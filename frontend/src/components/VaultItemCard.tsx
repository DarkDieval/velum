import { useState } from "react";
import type { VaultItemDecrypted } from "../api/vault";

interface VaultItemCardProps {
  item: VaultItemDecrypted;
  onDelete: (id: string) => void;
}

export const VaultItemCard = ({ item, onDelete }: VaultItemCardProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  // Formatear la fecha
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="vault-card">
      <div className="vault-card-header">
        <div>
          <h3 className="vault-card-title">{item.data.title}</h3>
          {item.data.folder && (
            <span className="vault-card-folder">📁 {item.data.folder}</span>
          )}
        </div>
        <button
          className="vault-card-delete"
          onClick={() => onDelete(item._id)}
          title="Eliminar"
        >
          🗑️
        </button>
      </div>

      <div className="vault-card-field">
        <span className="vault-card-label">Usuario:</span>
        <span className="vault-card-value">{item.data.username}</span>
        <button
          className="vault-card-copy"
          onClick={() => copyToClipboard(item.data.username)}
        >
          Copiar
        </button>
      </div>

      <div className="vault-card-field">
        <span className="vault-card-label">Contraseña:</span>
        <span className="vault-card-value">
          {showPassword ? item.data.password : "••••••••••"}
        </span>
        <button
          className="vault-card-copy"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
        <button
          className="vault-card-copy"
          onClick={() => copyToClipboard(item.data.password)}
        >
          Copiar
        </button>
      </div>

      {item.data.url && (
        <div className="vault-card-field">
          <span className="vault-card-label">URL:</span>
          <a
            href={item.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="vault-card-value"
          >
            {item.data.url}
          </a>
        </div>
      )}

      {item.data.notes && (
        <div className="vault-card-notes">{item.data.notes}</div>
      )}

      <div className="vault-card-date">
        🕒 Agregado el {formatDate(item.createdAt)}
      </div>
    </div>
  );
};
