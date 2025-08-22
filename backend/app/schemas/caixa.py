from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.product import Product

class CaixaBase(BaseModel):
    produto_id: Optional[int] = None  # Agora é opcional
    produto_nome: Optional[str] = None  # Para produtos excluídos
    quantidade: int
    tipo: str  # 'entrada' | 'saida'
    valor_total: float

class CaixaCreate(CaixaBase):
    produto_id: int  # Obrigatório na criação
    pass

class CaixaUpdate(BaseModel):
    produto_id: Optional[int] = None
    quantidade: Optional[int] = None
    tipo: Optional[str] = None  # 'entrada' | 'saida'
    valor_total: Optional[float] = None

class Caixa(CaixaBase):
    id: int
    data_movimentacao: datetime
    produto: Optional[Product] = None
    produto_nome: Optional[str] = None  # Para exibir nome quando produto foi excluído
    
    class Config:
        from_attributes = True

class CaixaResponse(BaseModel):
    movimentacoes: list[Caixa]
    total_entradas: float
    total_saidas: float
    saldo_atual: float
