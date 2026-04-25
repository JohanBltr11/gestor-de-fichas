# test_sticker.py (en la raíz del proyecto, no dentro de app/)
from backend.app.db.supabase_client import supabase
from backend.app.db.auth import sign_in

# 1. Inicia sesión con un usuario que ya existe en Supabase
user, session = sign_in("jsbeltranm@udistrital.edu.co", "12345")
print("Usuario:", user.id)

# 2. Agrega una ficha
supabase.rpc("add_sticker", {"p_sticker_id": "ARG1"}).execute()
print("Ficha ARG1 agregada")

# 3. Verifica que se insertó
response = supabase.from_("user_stickers").select("*").execute()
print("Fichas del usuario:", response.data)