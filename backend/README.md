# SIGMA Backend - API REST

API desenvolvida em FastAPI para gerenciamento de produtos e fluxo de caixa.

## 🚀 Como Executar

### Opção 1: Docker (Recomendado)
```bash
# Na raiz do projeto
docker-compose up -d
```

### Opção 2: Local
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📋 Endpoints

### Autenticação
- `POST /login` - Login (admin/123456)

### Produtos  
- `GET /produtos` - Listar produtos
- `POST /produtos` - Criar produto
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Excluir produto

### Fluxo de Caixa
- `GET /caixa` - Listar movimentações
- `POST /caixa/movimentacao` - Criar movimentação
- `PUT /caixa/movimentacao/{id}` - Atualizar movimentação
- `DELETE /caixa/movimentacao/{id}` - Excluir movimentação

## 📖 Documentação

Acesse: http://localhost:8000/docs

## 🔑 Autenticação

Usuário padrão:
- **Username:** admin
- **Password:** 123456
