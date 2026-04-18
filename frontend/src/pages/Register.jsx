import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Auth.css";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = "El nombre de usuario es obligatorio.";
    if (!form.email.trim()) errs.email = "El correo es obligatorio.";
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Las contraseñas no coinciden.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/album");
    } catch (err) {
      setErrors({ general: err?.response?.data?.detail || "Error al registrarse." });
    } finally {
      setLoading(false);
    }
  };

  /* Fortaleza de contraseña */
  const getStrength = (pw) => {
    if (pw.length === 0) return { level: 0, label: "" };
    if (pw.length < 6) return { level: 1, label: "Débil" };
    if (pw.length < 10 || !/[0-9]/.test(pw)) return { level: 2, label: "Media" };
    return { level: 3, label: "Fuerte" };
  };
  const strength = getStrength(form.password);

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-bg-circle c1" />
        <div className="auth-bg-circle c2" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-card auth-card--wide">
        <div className="auth-header">
          <div className="auth-badge">MUNDIAL 2026</div>
          <h1 className="auth-title">Panini<span className="accent">26</span></h1>
          <p className="auth-subtitle">Crea tu cuenta y empieza a coleccionar</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="field-group">
            <label htmlFor="username" className="field-label">Nombre de usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              className={`field-input ${errors.username ? "field-input--error" : ""}`}
              placeholder="coleccionista_2026"
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="email" className="field-label">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={`field-input ${errors.email ? "field-input--error" : ""}`}
              placeholder="tu@correo.com"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password" className="field-label">Contraseña</label>
            <div className="field-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className={`field-input ${errors.password ? "field-input--error" : ""}`}
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
            {form.password.length > 0 && (
              <div className="strength-bar">
                <div className={`strength-fill strength-fill--${strength.level}`} />
                <span className="strength-label">{strength.label}</span>
              </div>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword" className="field-label">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`field-input ${errors.confirmPassword ? "field-input--error" : ""}`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {errors.general && <p className="auth-error">{errors.general}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="auth-link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}