from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from app.database import create_tables
from app.routes import product, caixa
from app.auth import authenticate_user, create_access_token, Token, ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

app = FastAPI(title="SIGMA API", description="CRUD Produtos + Fluxo de Caixa", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar tabelas no startup
@app.on_event("startup")
async def startup():
    create_tables()

# Rota de login
@app.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    user = authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username ou password incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Rota de saúde
@app.get("/")
async def root():
    return {"message": "SIGMA API - CRUD Produtos + Fluxo de Caixa"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Incluir routers
app.include_router(product.router)
app.include_router(caixa.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
