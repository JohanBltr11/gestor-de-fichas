from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.deps import get_current_user_id
from app.db import stickers as stickers_db
from app.db.supabase_client import supabase

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────

class StickerToggle(BaseModel):
    sticker_id: str   # ej: "ARG1", "FWC07", "COL13"
    quantity:   int   # 0=no tengo, 1=tengo, 2=tengo+1 repetida, etc.


# ── Helpers ──────────────────────────────────────────────────────────

def sticker_exists(sticker_id: str) -> bool:
    """Verifica que el sticker_id exista en la tabla stickers."""
    res = (
        supabase.table("stickers")
        .select("id")
        .eq("id", sticker_id)
        .limit(1)
        .execute()
    )
    return len(res.data) > 0


# ── Endpoints ────────────────────────────────────────────────────────

@router.get("/collection")
def get_collection(user_id: str = Depends(get_current_user_id)):
    """
    Devuelve todas las fichas marcadas por el usuario.

    Respuesta:
    {
      "user_id": "uuid...",
      "stickers": [
        { "sticker_id": "ARG1",  "quantity": 1, "type": "escudo" },
        { "sticker_id": "COL13", "quantity": 3, "type": "foto_equipo" },
        { "sticker_id": "FWC07", "quantity": 1, "type": "especial" }
      ]
    }

    El frontend combina esta lista con su catálogo local (ALL_STICKERS)
    usando sticker_id como clave.
    """
    try:
        data = stickers_db.get_user_stickers(user_id)
        return {"user_id": user_id, "stickers": data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/toggle")
def toggle_sticker(
    body: StickerToggle,
    user_id: str = Depends(get_current_user_id)
):
    """
    Marca, actualiza o elimina una ficha de la colección.

    quantity = 0  → elimina (no la tiene)
    quantity = 1  → la tiene (sin repetidas)
    quantity = 2  → la tiene + 1 repetida
    quantity = N  → la tiene + (N-1) repetidas

    Valida que el sticker_id exista en la tabla stickers antes de guardar.
    """
    if body.quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="quantity no puede ser negativo."
        )

    # Validar que la ficha existe en el catálogo
    if body.quantity > 0 and not sticker_exists(body.sticker_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"La ficha '{body.sticker_id}' no existe en el catálogo."
        )

    try:
        stickers_db.upsert_sticker(user_id, body.sticker_id, body.quantity)
        return {
            "sticker_id": body.sticker_id,
            "quantity":   body.quantity,
            "action":     "deleted" if body.quantity == 0 else "saved",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/repeated")
def get_repeated(user_id: str = Depends(get_current_user_id)):
    """
    Devuelve solo las fichas con quantity >= 2 (tiene al menos 1 repetida).
    Útil para la pantalla de intercambios.
    """
    try:
        all_stickers = stickers_db.get_user_stickers(user_id)
        repeated = [s for s in all_stickers if s["quantity"] >= 2]
        return {"user_id": user_id, "repeated": repeated}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )