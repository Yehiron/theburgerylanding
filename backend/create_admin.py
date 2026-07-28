import os
from database import SessionLocal, engine
import models
from auth import get_password_hash

def init_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.username == "admin").first()
    if not user:
        hashed_password = get_password_hash("admin123")
        admin_user = models.User(username="admin", hashed_password=hashed_password)
        db.add(admin_user)
        db.commit()
        print("Admin user created (admin / admin123)")
    else:
        print("Admin user already exists")
    db.close()

if __name__ == "__main__":
    init_db()
