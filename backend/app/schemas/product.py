from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    valor: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    nome: Optional[str] = None
    valor: Optional[float] = None

class Product(ProductBase):
    id: int
    
    class Config:
        from_attributes = True
