import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useAuth } from "../context/useAuth";
import "./UnlockVaultModal.css";

interface UnlockVaultModalProps {
  isOpen: boolean;
}

export const UnlockVaultModal = ({ isOpen }: UnlockVaultModalProps) => {
  const { unlock, signout, user } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await unlock(password);
      setPassword("");
    } catch {
      setError("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unlock-overlay">
      <div className="unlock-content">
        <img src="/velum-logo-1.png" alt="Velum" className="unlock-logo" />
        <h2 className="unlock-title">Desbloquea tu vault</h2>
        <p className="unlock-subtitle">
          Hola {user?.name}, ingresa tu contraseña maestra para desbloquear tus
          contraseñas.
        </p>

        <form onSubmit={handleSubmit} className="unlock-form">
          <input
            type="password"
            placeholder="Contraseña maestra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="unlock-input"
            autoFocus
          />

          {error && <p className="unlock-error">{error}</p>}

          <button type="submit" disabled={loading} className="unlock-submit">
            {loading ? "Desbloqueando..." : "Desbloquear"}
          </button>
        </form>

        <button className="unlock-signout" onClick={signout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
