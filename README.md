# 🚀 SIGMA - Sistema de Gestão de Produtos

Sistema completo para gerenciamento de produtos e controle de fluxo de caixa, desenvolvido com **React** e **FastAPI**.

## 📋 **Sobre o Projeto**

O SIGMA é uma solução completa que oferece:
- **CRUD de Produtos** - Gestão completa de produtos (nome, descrição, preço)
- **Fluxo de Caixa** - Controle de entradas e saídas com histórico
- **Autenticação JWT** - Sistema seguro de autenticação
- **Interface Moderna** - Design responsivo e intuitivo

## 🛠️ **Tecnologias Utilizadas**

### **Backend**
- **Python 3.11** + **FastAPI**
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Banco de dados)
- **JWT** (Autenticação)
- **Pydantic** (Validação)

### **Frontend**
- **React 18** + **Vite**
- **Tailwind CSS** (Estilização)
- **Axios** (HTTP Client)
- **React Router** (Navegação)

### **Infraestrutura**
- **Docker** + **Docker Compose**
- **PostgreSQL** (Containerizado)

---

## 🚀 **Como Executar**

### **Pré-requisitos**
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### **1. Clone o Repositório**
```bash
git clone <repository-url>
cd sigma
```

### **2. Execute com Docker**
```bash
docker-compose up --build
```

### **3. Acesse a Aplicação**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000  
- **Documentação:** http://localhost:8000/docs

### **4. Credenciais Padrão**
- **Usuário:** `admin`
- **Senha:** `123456`

---

## 📡 **API Endpoints**

### **Autenticação**
- `POST /login` - Login do usuário

### **Produtos**
- `GET /produtos` - Listar produtos
- `GET /produtos/{id}` - Buscar produto por ID  
- `POST /produtos` - Criar produto
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Excluir produto

### **Fluxo de Caixa**
- `GET /caixa` - Listar movimentações
- `POST /caixa/movimentacao` - Criar movimentação
- `PUT /caixa/movimentacao/{id}` - Editar movimentação
- `DELETE /caixa/movimentacao/{id}` - Excluir movimentação

---

## 📮 **Testando com Postman**

### **📁 Importar Collection**
1. Abra o **Postman**
2. Clique em **"Import"**
3. Selecione o arquivo `SIGMA_API_Collection.json`
4. As variáveis de ambiente já estão configuradas

### **🎯 Sequência de Testes Recomendada**

1. **Login** → `POST /login` (token salvo automaticamente)
2. **Criar Produto** → `POST /produtos`
3. **Listar Produtos** → `GET /produtos`
4. **Buscar por ID** → `GET /produtos/{id}`
5. **Movimentação Entrada** → `POST /caixa/movimentacao`
6. **Movimentação Saída** → `POST /caixa/movimentacao`
7. **Ver Fluxo de Caixa** → `GET /caixa`
8. **Editar Produto** → `PUT /produtos/{id}`
9. **Excluir Produto** → `DELETE /produtos/{id}`

---

## 🖥️ **Desenvolvimento Local**

### **Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*Acesso:* http://localhost:8000

### **Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```
*Acesso:* http://localhost:3000

### **Banco de Dados**
```bash
# PostgreSQL via Docker
docker run --name sigma-db -e POSTGRES_PASSWORD=sigma_password -p 5432:5432 -d postgres
```

---

## 🎯 **Funcionalidades Implementadas**

### **✅ Requisitos Atendidos**
- ✅ **CRUD Produtos** - Create, Read, Update, Delete
- ✅ **Fluxo de Caixa** - Controle de entradas/saídas 
- ✅ **Stack Python** - FastAPI + PostgreSQL
- ✅ **Stack React** - Interface moderna
- ✅ **Docker** - Containerização completa
- ✅ **Autenticação JWT** - Sistema seguro
- ✅ **Collection Postman** - Testes prontos

### **🌟 Diferenciais Implementados**
- ✅ **Interface Responsiva** - Mobile-first design
- ✅ **Validações Robustas** - Frontend e backend
- ✅ **Documentação Automática** - Swagger/OpenAPI
- ✅ **Tratamento de Erros** - UX aprimorada  
- ✅ **Código Limpo** - Arquitetura modular
- ✅ **Boas Práticas** - Padrões de desenvolvimento

---

## 🗂️ **Estrutura do Banco**

```sql
-- Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    valor DECIMAL(10,2) NOT NULL
);

-- Fluxo de Caixa  
CREATE TABLE caixa (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER REFERENCES produtos(id),
    produto_nome VARCHAR(100),
    quantidade INTEGER NOT NULL,
    tipo VARCHAR(7) CHECK (tipo IN ('entrada', 'saida')),
    valor_total DECIMAL(10,2) NOT NULL,
    data_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ **Comandos Úteis**

```bash
# Subir serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços  
docker-compose down

# Rebuild completo
docker-compose down -v && docker-compose up --build

# Logs específicos
docker-compose logs backend
docker-compose logs frontend
```

---

## 📊 **Estrutura do Projeto**

```
sigma/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── routes/         # Rotas da API
│   │   ├── schemas/        # Schemas Pydantic
│   │   └── main.py        # Aplicação principal
│   └── Dockerfile
├── frontend/               # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   └── services/      # Integração com API
│   └── Dockerfile
├── docker-compose.yml     # Orquestração
└── SIGMA_API_Collection.json  # Testes Postman
```

---

**Desenvolvido para o Desafio SIGMA** 🚀

*Sistema completo com CRUD de produtos, fluxo de caixa e autenticação JWT*
