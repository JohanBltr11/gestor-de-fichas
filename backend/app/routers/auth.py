from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.db import auth as auth_db

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email:    EmailStr
    password: str


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


# ── Endpoints ────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    """
    Crea un nuevo usuario en Supabase Auth.
    Supabase envía un correo de confirmación automáticamente.
    """
    try:
        user = auth_db.sign_up(body.email, body.password)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se pudo crear el usuario. El correo puede estar en uso."
            )
        return {
            "message": "Usuario creado. Revisa tu correo para confirmar.",
            "user_id": str(user.id),
            "email":   user.email,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login")
def login(body: LoginRequest):
    """
    Inicia sesión y devuelve el access_token JWT de Supabase.
    El frontend debe guardar este token y enviarlo en cada request
    como: Authorization: Bearer <token>
    """
    try:
        user, session = auth_db.sign_in(body.email, body.password)
        if user is None or session is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos."
            )
        return {
            "access_token": session.access_token,
            "token_type":   "bearer",
            "user": {
                "id":    str(user.id),
                "email": user.email,
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos."
        )