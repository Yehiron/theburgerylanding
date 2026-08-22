import os
import time
import uuid
import json
from collections import defaultdict
from typing import List
from dotenv import dotenv_values
from fastapi import FastAPI, Depends, HTTPException, Request, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
from image_service import ImageService
import io

import models
import schemas
import auth
from database import engine, get_db

# Crea tablas si no existen
models.Base.metadata.create_all(bind=engine)

# Small forward-compatible migration for installations created before product ordering.
with engine.begin() as connection:
    columns = [row[1] for row in connection.execute(text("PRAGMA table_info(products)"))]
    if "order" not in columns:
        connection.execute(text('ALTER TABLE products ADD COLUMN "order" INTEGER DEFAULT 0'))

    option_columns = [row[1] for row in connection.execute(text("PRAGMA table_info(product_options)"))]
    if option_columns and "price" not in option_columns and "price_adjustment" in option_columns:
        connection.execute(text('ALTER TABLE product_options RENAME COLUMN price_adjustment TO price'))

    category_columns = [row[1] for row in connection.execute(text("PRAGMA table_info(categories)"))]
    if category_columns and "is_highlighted" not in category_columns:
        connection.execute(text('ALTER TABLE categories ADD COLUMN is_highlighted BOOLEAN DEFAULT 0'))
        # Preserva el estilo dorado que antes se activaba comparando el nombre de la categoría.
        connection.execute(text(
            "UPDATE categories SET is_highlighted = 1 "
            "WHERE LOWER(REPLACE(name, ' ', '')) = 'burgermaster'"
        ))

app = FastAPI(title="The Burgery API")

_cors_setting = os.getenv("CORS_ORIGINS") or dotenv_values().get("CORS_ORIGINS") or "http://localhost:5173,http://localhost:3000"
cors_origins = [origin.strip() for origin in _cors_setting.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
image_service = ImageService(upload_dir="uploads")

LOGIN_RATE_LIMIT = 5
LOGIN_RATE_WINDOW_SECONDS = 5 * 60
_login_attempts = defaultdict(list)

def enforce_login_rate_limit(client_ip: str):
    now = time.time()
    attempts = [t for t in _login_attempts[client_ip] if now - t < LOGIN_RATE_WINDOW_SECONDS]
    if len(attempts) >= LOGIN_RATE_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Demasiados intentos de inicio de sesión. Inténtalo de nuevo en unos minutos."
        )
    attempts.append(now)
    _login_attempts[client_ip] = attempts

@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(request: Request, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    enforce_login_rate_limit(request.client.host)
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- Categories ---
@app.get("/api/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).filter(models.Category.deleted_at == None).order_by(models.Category.order).all()

@app.post("/api/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.put("/api/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in category.model_dump().items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.delete("/api/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    import datetime
    db_category.deleted_at = datetime.datetime.utcnow()
    db.commit()
    return {"ok": True}

def parse_product_options(options_json: str) -> List[schemas.ProductOptionCreate]:
    try:
        raw_options = json.loads(options_json)
    except (TypeError, ValueError) as error:
        raise HTTPException(status_code=422, detail="El formato de las opciones no es válido.") from error
    try:
        return [schemas.ProductOptionCreate(**option) for option in raw_options]
    except Exception as error:
        raise HTTPException(status_code=422, detail="Una de las opciones tiene datos inválidos.") from error

# --- Products ---
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.deleted_at == None).order_by(models.Product.order, models.Product.id).all()

@app.post("/api/products", response_model=schemas.Product)
def create_product(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    category_id: int = Form(...),
    order: int = Form(0),
    is_featured: bool = Form(False),
    is_available: bool = Form(True),
    options: str = Form("[]"),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not db.query(models.Category).filter(models.Category.id == category_id, models.Category.deleted_at == None).first():
        raise HTTPException(status_code=422, detail="Selecciona una categoría válida.")
    parsed_options = parse_product_options(options)
    image_url = None
    if image:
        # Use ImageService to validate, optimize and save the uploaded image.
        image_url = image_service.optimize_upload(image)

    db_product = models.Product(
        name=name,
        description=description,
        price=price,
        category_id=category_id,
        is_featured=is_featured,
        is_available=is_available,
        order=order,
        image_url=image_url
    )
    try:
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        db_product.options = [
            models.ProductOption(name=o.name, price=o.price, order=o.order)
            for o in parsed_options
        ]
        db.commit()
        db.refresh(db_product)
        return db_product
    except Exception as error:
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="No se pudo guardar el producto. Inténtalo nuevamente."
        ) from error

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    category_id: int = Form(...),
    order: int = Form(0),
    is_featured: bool = Form(False),
    is_available: bool = Form(True),
    options: str = Form("[]"),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if not db.query(models.Category).filter(models.Category.id == category_id, models.Category.deleted_at == None).first():
        raise HTTPException(status_code=422, detail="Selecciona una categoría válida.")
    parsed_options = parse_product_options(options)

    if image:
        # Replace existing image via ImageService
        db_product.image_url = image_service.optimize_upload(image)

    db_product.name = name
    db_product.description = description
    db_product.price = price
    db_product.category_id = category_id
    db_product.is_featured = is_featured
    db_product.is_available = is_available
    db_product.order = order
    db_product.options = [
        models.ProductOption(name=o.name, price=o.price, order=o.order)
        for o in parsed_options
    ]

    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    import datetime
    db_product.deleted_at = datetime.datetime.utcnow()
    db.commit()
    return {"ok": True}
