import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

// Usuario de prueba hardcodeado — eliminar cuando conectes el backend
const FAKE_USER = {
  email: "test@panini.com",
  password: "123456",
  username: "Coleccionista",
};

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = async (email, password) => {
    // Simula validación — reemplazar por llamada real al API
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      const fakeToken = "fake-jwt-token-2026";
      setToken(fakeToken);
      setUser({ username: FAKE_USER.username, email });
    } else {
      throw { response: { data: { detail: "Correo o contraseña incorrectos." } } };
    }
  };

  const register = async (username, email, password) => {
    // Simula registro exitoso
    const fakeToken = "fake-jwt-token-2026";
    setToken(fakeToken);
    setUser({ username, email });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}