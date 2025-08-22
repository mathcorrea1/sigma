from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Caixa(Base):
    __tablename__ = "caixa"
    
    id = Column(Integer, primary_key=True, index=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), nullable=True)  # Agora pode ser NULL
    produto_nome = Column(String, nullable=True)  # Para preservar o nome do produto excluído
    quantidade = Column(Integer, nullable=False)
    tipo = Column(String, nullable=False)  # 'entrada' | 'saida'
    valor_total = Column(Float, nullable=False)
    data_movimentacao = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamento com produto
    produto = relationship("Product", foreign_keys=[produto_id])
