import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.email || !form.password) {
    setError("Completa todos los campos.");
    return;
  }
  setLoading(true);
  try {
    await login(form.email, form.password);
    navigate("/album");
  } catch (err) {
    const detail = err?.response?.data?.detail;
    // detail puede ser string o array de objetos (Pydantic)
    if (Array.isArray(detail)) {
      setError(detail.map(e => e.msg).join(", "));
    } else {
      setError(detail || "Credenciales incorrectas.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-root">
      {/* Fondo decorativo */}
      <div className="auth-bg">
        <div className="auth-bg-circle c1" />
        <div className="auth-bg-circle c2" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-card">
        {/* Logo / encabezado */}
        <div className="auth-header">
          <div className="auth-badge">MUNDIAL 2026</div>
          <h1 className="auth-title">Panini<span className="accent">26</span></h1>
          <p className="auth-subtitle">Ingresa a tu álbum digital</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field-group">
            <label htmlFor="email" className="field-label">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={`field-input ${error ? "field-input--error" : ""}`}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="field-group">
            <label htmlFor="password" className="field-label">Contraseña</label>
            <div className="field-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`field-input ${error ? "field-input--error" : ""}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="field-eye"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Mostrar contraseña"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Entrar al álbum"}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="auth-link">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
