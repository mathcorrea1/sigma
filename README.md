# 🚀 SIGMA - CRUD Produtos + Fluxo de Caixa

Sistema completo para gerenciamento de produtos e controle de fluxo de caixa.

## 📌 **Stack Tecnológica**

- **Backend:** Python + FastAPI
- **Frontend:** ReactJS + Vite + Tailwind CSS
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker + Docker Compose
- **Autenticação:** JWT (JSON Web Tokens)

---

## 🚀 **Como Executar**

### **Pré-requisitos**
- Docker e Docker Compose instalados
- Git (para clonar o repositório)

### **1. Clone e Execute**

```bash
git clone <repository-url>
cd SIGMA
docker-compose up --build
```

### **2. Acesse a Aplicação**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentação da API:** http://localhost:8000/docs

### **3. Credenciais de Acesso**
- **Usuário:** `admin`
- **Senha:** `123456`

---

## 📋 **Endpoints da API**

### **Autenticação**
- `POST /login` - Autenticação do usuário

### **Produtos**
- `GET /produtos` - Listar todos os produtos
- `GET /produtos/{id}` - Buscar produto por ID
- `POST /produtos` - Criar novo produto
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Deletar produto

### **Fluxo de Caixa**
- `GET /caixa` - Listar movimentações e totais
- `POST /caixa/movimentacao` - Criar nova movimentação
- `PUT /caixa/movimentacao/{id}` - Atualizar movimentação
- `DELETE /caixa/movimentacao/{id}` - Excluir movimentação

---

## 📮 **Testando com Postman**

### **📁 Download da Collection**
A collection do Postman está localizada em:
```
SIGMA_API_Collection.json
```

### **🔧 Como Importar no Postman**

1. **Abra o Postman**
2. **Clique em "Import"** (botão no canto superior esquerdo)
3. **Selecione "Files"**
4. **Escolha o arquivo** `SIGMA_API_Collection.json`
5. **Clique em "Import"**

### **⚙️ Configuração de Variáveis**

A collection já vem com as variáveis configuradas:
- `{{base_url}}`: http://localhost:8000
- `{{token}}`: (será preenchido automaticamente após login)

### **🎯 Sequência Recomendada de Execução**

#### **1. Autenticação** 
```
POST {{base_url}}/login
```
**Body (raw JSON):**
```json
{
    "username": "admin",
    "password": "123456"
}
```
> ✅ O token será salvo automaticamente!

#### **2. Criar Produtos**
```
POST {{base_url}}/produtos
```
**Body (raw JSON):**
```json
{
    "nome": "Notebook Gamer",
    "descricao": "Notebook para jogos e trabalho",
    "valor": 2999.99
}
```

#### **3. Listar Produtos**
```
GET {{base_url}}/produtos
```

#### **4. Atualizar Produto**
```
PUT {{base_url}}/produtos/1
```
**Body (raw JSON):**
```json
{
    "nome": "Notebook Gamer Pro",
    "descricao": "Notebook para jogos e trabalho profissional",
    "valor": 3499.99
}
```

#### **5. Criar Movimentações de Caixa**

**Entrada:**
```
POST {{base_url}}/caixa/movimentacao
```
**Body (raw JSON):**
```json
{
    "produto_id": 1,
    "quantidade": 5,
    "tipo": "entrada",
    "valor_total": 14999.95
}
```

**Saída:**
```
POST {{base_url}}/caixa/movimentacao
```
**Body (raw JSON):**
```json
{
    "produto_id": 1,
    "quantidade": 2,
    "tipo": "saida",
    "valor_total": 5999.98
}
```

#### **6. Consultar Fluxo de Caixa**
```
GET {{base_url}}/caixa
```

#### **7. Editar Movimentação**
```
PUT {{base_url}}/caixa/movimentacao/1
```
**Body (raw JSON):**
```json
{
    "quantidade": 3,
    "valor_total": 8999.97
}
```

#### **8. Excluir Produto**
```
DELETE {{base_url}}/produtos/1
```

---

## 🛠️ **Desenvolvimento Local**

### **Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Frontend (React)**
```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 **Funcionalidades Implementadas**

### **✅ Backend**
- ✅ CRUD completo de produtos
- ✅ Sistema de fluxo de caixa
- ✅ Autenticação JWT
- ✅ Validação de dados
- ✅ Documentação automática (Swagger)

### **✅ Frontend**
- ✅ Interface moderna e responsiva
- ✅ Autenticação com proteção de rotas
- ✅ CRUD de produtos com formulários
- ✅ Dashboard de fluxo de caixa
- ✅ Integração completa com a API

### **✅ Infraestrutura**
- ✅ Containerização com Docker
- ✅ Orquestração com Docker Compose
- ✅ Banco PostgreSQL
- ✅ Volumes persistentes

---

## �️ **Estrutura do Banco**

### **Produtos**
- id (PK)
- nome
- descricao  
- valor

### **Caixa**
- id (PK)
- produto_id (FK - pode ser NULL)
- produto_nome (para preservar histórico)
- quantidade
- tipo ('entrada' | 'saida')
- valor_total
- data_movimentacao

---

Desenvolvido para o Desafio SIGMA 🚀

---

## 📋 **Endpoints da API**

### **Autenticação**
- `POST /login` - Autenticação do usuário

### **Produtos**
- `GET /produtos` - Listar todos os produtos
- `GET /produtos/{id}` - Buscar produto por ID
- `POST /produtos` - Criar novo produto
- `PUT /produtos/{id}` - Atualizar produto
- `DELETE /produtos/{id}` - Deletar produto

### **Fluxo de Caixa**
- `GET /caixa` - Listar movimentações e totais
- `POST /caixa/movimentacao` - Criar nova movimentação

### **Utilitários**
- `GET /` - Informações da API
- `GET /health` - Status da aplicação

---

## 📮 **Testando com Postman**

### **1. Importar Collection**
1. Abra o Postman
2. Clique em \"Import\"
3. Selecione o arquivo `SIGMA_API_Collection.json`

### **2. Configurar Variáveis**
A collection já vem com as variáveis configuradas:
- `base_url`: http://localhost:8000
- `token`: (será preenchido automaticamente após login)

### **3. Sequência de Testes Recomendada**

#### **Passo 1: Autenticação**
```
POST /login
```
**Body:**
```json
{
    \"username\": \"admin\",
    \"password\": \"123456\"
}
```
> ✅ O token será salvo automaticamente!

#### **Passo 2: Criar Produtos**
```
POST /produtos
```
**Body:**
```json
{
    \"nome\": \"Notebook Gamer\",
    \"descricao\": \"Notebook para jogos e trabalho\",
    \"valor\": 2999.99
}
```

#### **Passo 3: Listar Produtos**
```
GET /produtos
```

#### **Passo 4: Criar Movimentações**
```
POST /caixa/movimentacao
```
**Body (Entrada):**
```json
{
    \"produto_id\": 1,
    \"quantidade\": 5,
    \"tipo\": \"entrada\",
    \"valor_total\": 14999.95
}
```

**Body (Saída):**
```json
{
    \"produto_id\": 1,
    \"quantidade\": 2,
    \"tipo\": \"saida\",
    \"valor_total\": 5999.98
}
```

#### **Passo 5: Consultar Fluxo de Caixa**
```
GET /caixa
```

---

## 🎯 **Funcionalidades Implementadas**

### **✅ Backend (FastAPI)**
- ✅ Estrutura modular (models, schemas, routes)
- ✅ CRUD completo de produtos
- ✅ Sistema de fluxo de caixa
- ✅ Autenticação JWT
- ✅ Validação de dados com Pydantic
- ✅ CORS configurado
- ✅ Documentação automática (Swagger)

### **✅ Frontend (React)**
- ✅ Interface moderna com Tailwind CSS
- ✅ Navegação com React Router
- ✅ Autenticação com proteção de rotas
- ✅ CRUD de produtos com formulários
- ✅ Dashboard de fluxo de caixa
- ✅ Integração completa com a API
- ✅ Design responsivo

### **✅ Infraestrutura**
- ✅ Containerização com Docker
- ✅ Orquestração com Docker Compose
- ✅ Banco PostgreSQL
- ✅ Variáveis de ambiente
- ✅ Health checks
- ✅ Volumes persistentes

### **✅ Extras**
- ✅ Collection Postman completa
- ✅ Documentação detalhada
- ✅ Código limpo e organizado
- ✅ Boas práticas de desenvolvimento

---

## 🛠️ **Comandos Úteis**

### **Docker**
```bash
# Subir os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar os serviços
docker-compose down

# Rebuild completo
docker-compose down -v
docker-compose up --build
```

### **Backend (Desenvolvimento)**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Frontend (Desenvolvimento)**
```bash
cd frontend
npm install
npm run dev
```

---

## 🗂️ **Banco de Dados**

### **Tabelas Criadas Automaticamente:**
1. **produtos**
   - id (PK)
   - nome
   - descricao
   - valor

2. **caixa**
   - id (PK)
   - produto_id (FK)
   - quantidade
   - tipo ('entrada' | 'saida')
   - valor_total
   - data_movimentacao

---

## 🎨 **Interface do Usuário**

### **Páginas Disponíveis:**
1. **Login** (`/login`)
   - Autenticação de usuários
   - Redirecionamento automático

2. **Produtos** (`/produtos`)
   - Listagem em tabela
   - Formulário de criação/edição
   - Ações de editar e excluir

3. **Fluxo de Caixa** (`/caixa`)
   - Dashboard com totais
   - Formulário de movimentação
   - Histórico de movimentações

---

## 🔧 **Configurações de Ambiente**

### **Variáveis (.env):**
```env
# Database
POSTGRES_USER=sigma_user
POSTGRES_PASSWORD=sigma_password
POSTGRES_DB=sigma_db

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 📝 **Próximos Passos / Melhorias**

### **Sugestões para Expansão:**
- [ ] Cadastro de usuários
- [ ] Roles e permissões
- [ ] Relatórios em PDF
- [ ] Gráficos e estatísticas
- [ ] API de upload de imagens
- [ ] Testes automatizados
- [ ] Deploy em produção
- [ ] Backup automático

---

## 🤝 **Contribuição**

Este projeto foi desenvolvido como um desafio técnico seguindo as melhores práticas de desenvolvimento. Sinta-se à vontade para sugerir melhorias!

---

## 🏆 **Tecnologias e Conceitos Demonstrados**

- ✅ **Python/FastAPI** - API REST moderna
- ✅ **SQLAlchemy** - ORM e migrations
- ✅ **Pydantic** - Validação de dados
- ✅ **JWT** - Autenticação stateless
- ✅ **React Hooks** - Estado e efeitos
- ✅ **React Router** - Navegação SPA
- ✅ **Tailwind CSS** - Design system
- ✅ **Docker** - Containerização
- ✅ **PostgreSQL** - Banco relacional
- ✅ **Axios** - Cliente HTTP
- ✅ **Postman** - Testes de API

---

**Desenvolvido para o Desafio SIGMA** 🚀
