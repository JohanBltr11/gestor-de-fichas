from fastapi import Header, HTTPException, status
from app.db.supabase_client import supabase


async def get_current_user_id(authorization: str = Header(...)) -> str:
    """
    Dependencia reutilizable.
    Lee el JWT del header Authorization: Bearer <token>
    y lo valida con Supabase para obtener el user_id (UUID).
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o ausente."
        )

    token = authorization.removeprefix("Bearer ").strip()

    try:
        response = supabase.auth.get_user(token)
        user = response.user
        if user is None:
            raise ValueError("Usuario no encontrado")
        return str(user.id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado o inválido. Inicia sesión de nuevo."
        )