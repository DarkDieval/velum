import { useState } from "react";
import type { SyntheticEvent } from "react";
import type { VaultItemData } from "../api/vault";

interface VaultItemFormProps {
  onSubmit: (data: VaultItemData) => Promise<void>;
  onCancel: () => void;
  existingFolders?: string[];
}

export const VaultItemForm = ({
  onSubmit,
  onCancel,
  existingFolders = [],
}: VaultItemFormProps) => {
  const [form, setForm] = useState<VaultItemData>({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
    folder: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof VaultItemData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vault-form">
      <input
        type="text"
        placeholder="Título (ej. Gmail)"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
        required
        className="vault-input"
      />

      <input
        type="text"
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => handleChange("username", e.target.value)}
        required
        className="vault-input"
      />

      <div className="vault-password-group">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
          autoComplete="new-password"
          className="vault-input"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="vault-password-toggle"
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <input
        type="url"
        placeholder="URL (opcional)"
        value={form.url}
        onChange={(e) => handleChange("url", e.target.value)}
        className="vault-input"
      />

      <input
        type="text"
        placeholder="Bolsillo (ej. Trabajo, Personal, Finanzas)"
        value={form.folder}
        onChange={(e) => handleChange("folder", e.target.value)}
        list="existing-folders"
        className="vault-input"
      />
      <datalist id="existing-folders">
        {existingFolders.map((folder) => (
          <option key={folder} value={folder} />
        ))}
      </datalist>

      <textarea
        placeholder="Notas (opcional)"
        value={form.notes}
        onChange={(e) => handleChange("notes", e.target.value)}
        className="vault-input vault-textarea"
        rows={3}
      />

      <div className="vault-form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};
