import { useState, useEffect } from "react";
import type { SyntheticEvent } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) => {
  const { signin, signup } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setName("");
      setEmail("");
      setPassword("");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup({ name, email, password });
      } else {
        await signin({ email, password });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
  };

  const handleOverlayMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2 className="modal-title">
          {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
        </h2>

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="modal-input"
            />
          )}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modal-input"
          />

          <input
            type="password"
            placeholder={
              mode === "signup"
                ? "Contraseña (mínimo 12 caracteres)"
                : "Contraseña"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={mode === "signup" ? 12 : undefined}
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            className="modal-input"
          />

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" disabled={loading} className="modal-submit">
            {loading
              ? "Cargando..."
              : mode === "signin"
                ? "Entrar"
                : "Registrarme"}
          </button>
        </form>

        <p className="modal-switch">
          {mode === "signin" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button
            type="button"
            onClick={switchMode}
            className="modal-switch-btn"
          >
            {mode === "signin" ? "Regístrate" : "Inicia sesión"}
          </button>
        </p>
      </div>
    </div>
  );
};
