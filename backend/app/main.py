from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routers import auth, stickers

app = FastAPI(title="Panini 2026 API", version="1.0.0")

# ── CORS ────────────────────────────────────────────────────────────
# En producción reemplaza "*" por tu dominio de Vercel
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────
app.include_router(auth.router,     prefix="/auth",       tags=["Auth"])
app.include_router(stickers.router, prefix="/stickers",   tags=["Stickers"])

@app.get("/")
def root():
    return {"status": "ok", "app": "Panini Mundial 2026"}