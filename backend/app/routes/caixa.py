from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.caixa import Caixa
from app.models.product import Product
from app.schemas.caixa import CaixaCreate, CaixaUpdate, Caixa as CaixaSchema, CaixaResponse
from app.auth import get_current_user, User

router = APIRouter(prefix="/caixa", tags=["caixa"])

@router.post("/movimentacao", response_model=CaixaSchema)
async def create_movimentacao(
    movimentacao: CaixaCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar se produto existe
    product = db.query(Product).filter(Product.id == movimentacao.produto_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    # Validar tipo de movimentação
    if movimentacao.tipo not in ["entrada", "saida"]:
        raise HTTPException(status_code=400, detail="Tipo deve ser 'entrada' ou 'saida'")
    
    # Criar movimentação com nome do produto
    movimentacao_data = movimentacao.dict()
    movimentacao_data["produto_nome"] = product.nome  # Salvar nome do produto
    
    db_movimentacao = Caixa(**movimentacao_data)
    db.add(db_movimentacao)
    db.commit()
    db.refresh(db_movimentacao)
    
    # Carregar produto relacionado
    db.refresh(db_movimentacao)
    return db_movimentacao

@router.get("/", response_model=CaixaResponse)
async def read_caixa(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar todas as movimentações
    movimentacoes = db.query(Caixa).order_by(Caixa.data_movimentacao.desc()).all()
    
    # Calcular totais
    total_entradas = db.query(func.sum(Caixa.valor_total)).filter(Caixa.tipo == "entrada").scalar() or 0
    total_saidas = db.query(func.sum(Caixa.valor_total)).filter(Caixa.tipo == "saida").scalar() or 0
    saldo_atual = total_entradas - total_saidas
    
    return CaixaResponse(
        movimentacoes=movimentacoes,
        total_entradas=total_entradas,
        total_saidas=total_saidas,
        saldo_atual=saldo_atual
    )

@router.get("/movimentacao/{movimentacao_id}", response_model=CaixaSchema)
async def read_movimentacao(
    movimentacao_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movimentacao = db.query(Caixa).filter(Caixa.id == movimentacao_id).first()
    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")
    return movimentacao

@router.put("/movimentacao/{movimentacao_id}", response_model=CaixaSchema)
async def update_movimentacao(
    movimentacao_id: int,
    movimentacao_update: CaixaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar movimentação existente
    db_movimentacao = db.query(Caixa).filter(Caixa.id == movimentacao_id).first()
    if not db_movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")
    
    # Preparar dados para atualização
    update_data = movimentacao_update.dict(exclude_unset=True)
    
    # Verificar se produto existe (se produto_id foi fornecido)
    if "produto_id" in update_data and update_data["produto_id"]:
        product = db.query(Product).filter(Product.id == update_data["produto_id"]).first()
        if not product:
            raise HTTPException(status_code=404, detail="Produto não encontrado")
        update_data["produto_nome"] = product.nome
    
    # Validar tipo de movimentação (se fornecido)
    if "tipo" in update_data and update_data["tipo"] not in ["entrada", "saida"]:
        raise HTTPException(status_code=400, detail="Tipo deve ser 'entrada' ou 'saida'")
    
    # Atualizar campos
    for field, value in update_data.items():
        setattr(db_movimentacao, field, value)
    
    db.commit()
    db.refresh(db_movimentacao)
    return db_movimentacao

@router.delete("/movimentacao/{movimentacao_id}")
async def delete_movimentacao(
    movimentacao_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    movimentacao = db.query(Caixa).filter(Caixa.id == movimentacao_id).first()
    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")
    
    db.delete(movimentacao)
    db.commit()
    return {"message": "Movimentação removida com sucesso"}
