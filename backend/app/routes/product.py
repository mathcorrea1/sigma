from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.product import Product
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate
from app.auth import get_current_user, User

router = APIRouter(prefix="/produtos", tags=["produtos"])

@router.post("/", response_model=ProductSchema)
async def create_product(
    product: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=List[ProductSchema])
async def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductSchema)
async def read_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return product

@router.put("/{product_id}", response_model=ProductSchema)
async def update_product(
    product_id: int, 
    product_update: ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    update_data = product_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
async def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.models.caixa import Caixa
    
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Buscar movimentações relacionadas e preservar o nome do produto
    caixa_records = db.query(Caixa).filter(Caixa.produto_id == product_id).all()
    caixa_count = len(caixa_records)
    
    # Atualizar as movimentações para preservar o nome do produto e remover a referência
    for caixa in caixa_records:
        if not caixa.produto_nome:  # Só atualiza se ainda não tiver o nome salvo
            caixa.produto_nome = product.nome
        caixa.produto_id = None  # Remove a referência para permitir a exclusão
    
    # Excluir o produto
    db.delete(product)
    db.commit()
    
    if caixa_count > 0:
        return {
            "message": f"Produto removido com sucesso. {caixa_count} movimentação(ões) de caixa foram preservadas no histórico.",
            "movimentacoes_preservadas": caixa_count
        }
    else:
        return {"message": "Produto removido com sucesso"}
