from .supabase_client import supabase


def get_user_stickers(user_id: str) -> list[dict]:
    """
    Devuelve las fichas del usuario con su type de la tabla stickers.
    JOIN: user_stickers ← stickers (para traer el type)

    Respuesta: [
      { "sticker_id": "ARG1", "quantity": 2, "type": "escudo" },
      { "sticker_id": "COL13", "quantity": 1, "type": "foto_equipo" },
      ...
    ]
    """
    response = (
        supabase.table("user_stickers")
        .select("sticker_id, quantity, stickers(type)")
        .eq("user_id", user_id)
        .execute()
    )

    # Aplanar el join: { sticker_id, quantity, stickers: { type } }
    result = []
    for row in response.data:
        result.append({
            "sticker_id": row["sticker_id"],
            "quantity":   row["quantity"],
            "type":       row.get("stickers", {}).get("type") if row.get("stickers") else None,
        })
    return result


def upsert_sticker(user_id: str, sticker_id: str, quantity: int):
    """
    Inserta o actualiza una ficha del usuario.

    Convención de quantity:
      0  → no la tiene  (se elimina el registro)
      1  → la tiene, sin repetidas
      2  → la tiene + 1 repetida
      N  → la tiene + (N-1) repetidas
    """
    if quantity <= 0:
        return delete_sticker(user_id, sticker_id)

    response = (
        supabase.table("user_stickers")
        .upsert(
            {
                "user_id":    user_id,
                "sticker_id": sticker_id,
                "quantity":   quantity,
            },
            on_conflict="user_id,sticker_id"
        )
        .execute()
    )
    return response.data


def delete_sticker(user_id: str, sticker_id: str):
    """Elimina el registro: el usuario ya no tiene esa ficha."""
    response = (
        supabase.table("user_stickers")
        .delete()
        .eq("user_id", user_id)
        .eq("sticker_id", sticker_id)
        .execute()
    )
    return response.data