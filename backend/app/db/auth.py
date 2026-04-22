from .supabase_client import supabase

def sign_up(email: str, password: str):
    response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })
    return response.user

def sign_in(email: str, password: str):
    response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password
    })
    return response.user, response.session

def sign_out():
    supabase.auth.sign_out()

def get_current_user():
    response = supabase.auth.get_user()
    return response.user  # response.user.id es el UUID