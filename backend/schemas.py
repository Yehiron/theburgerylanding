from pydantic import BaseModel, ConfigDict
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class CategoryBase(BaseModel):
    name: str
    order: Optional[int] = 0

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_featured: Optional[bool] = False
    is_available: Optional[bool] = True
    category_id: int

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    image_url: Optional[str] = None
    created_at: datetime.datetime
    model_config = ConfigDict(from_attributes=True)
