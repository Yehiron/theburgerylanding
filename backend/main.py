import os
import uuid
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from image_service import ImageService
import io

import models
import schemas
import auth
from database import engine, get_db

# Crea tablas si no existen
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="The Burgery API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
image_service = ImageService(upload_dir="uploads")

@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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

# --- Products ---
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).filter(models.Product.deleted_at == None).all()

@app.post("/api/products", response_model=schemas.Product)
def create_product(
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    category_id: int = Form(...),
    is_featured: bool = Form(False),
    is_available: bool = Form(True),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
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
        image_url=image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/api/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(None),
    price: float = Form(...),
    category_id: int = Form(...),
    is_featured: bool = Form(False),
    is_available: bool = Form(True),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    if image:
        # Replace existing image via ImageService
        db_product.image_url = image_service.optimize_upload(image)

    db_product.name = name
    db_product.description = description
    db_product.price = price
    db_product.category_id = category_id
    db_product.is_featured = is_featured
    db_product.is_available = is_available

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
