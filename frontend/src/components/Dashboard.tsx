import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../context/useAuth";
import {
  getVaultItems,
  createVaultItem,
  deleteVaultItem,
  type VaultItemEncrypted,
  type VaultItemDecrypted,
  type VaultItemData,
} from "../api/vault";
import { encryptData, decryptData } from "../crypto/crypto";
import { VaultItemForm } from "./VaultItemForm";
import { VaultItemCard } from "./VaultItemCard";
import "./Dashboard.css";

type SortOption = "recent" | "oldest" | "az" | "za";

export const Dashboard = () => {
  const { user, token, derivedKey, signout } = useAuth();
  const [items, setItems] = useState<VaultItemDecrypted[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const loadItems = useCallback(async () => {
    if (!token || !derivedKey) return;
    setLoading(true);
    try {
      const encryptedItems: VaultItemEncrypted[] = await getVaultItems(token);
      const decrypted: VaultItemDecrypted[] = await Promise.all(
        encryptedItems.map(async (item) => {
          try {
            const data = await decryptData<VaultItemData>(
              derivedKey,
              item.encryptedData,
              item.iv,
            );
            return { ...item, data };
          } catch {
            return {
              ...item,
              data: {
                title: "⚠️ No se pudo descifrar",
                username: "",
                password: "",
              },
            };
          }
        }),
      );
      setItems(decrypted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, derivedKey]);

  useEffect(() => {
    queueMicrotask(() => {
      loadItems();
    });
  }, [loadItems]);

  const handleAddItem = async (data: VaultItemData) => {
    if (!token || !derivedKey) return;
    const { encryptedData, iv } = await encryptData(derivedKey, data);
    await createVaultItem(token, encryptedData, iv);
    setShowForm(false);
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("¿Seguro que quieres eliminar este item?")) return;
    await deleteVaultItem(token, id);
    await loadItems();
  };

  const folders = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.data.folder) set.add(item.data.folder);
    });
    return Array.from(set).sort();
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const matchesSearch =
        !term ||
        item.data.title.toLowerCase().includes(term) ||
        item.data.username.toLowerCase().includes(term);
      const matchesFolder = !activeFolder || item.data.folder === activeFolder;
      return matchesSearch && matchesFolder;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "az":
        sorted.sort((a, b) =>
          a.data.title.localeCompare(b.data.title, "es", {
            sensitivity: "base",
          }),
        );
        break;
      case "za":
        sorted.sort((a, b) =>
          b.data.title.localeCompare(a.data.title, "es", {
            sensitivity: "base",
          }),
        );
        break;
    }
    return sorted;
  }, [items, search, activeFolder, sortBy]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tu Vault</h1>
          <p className="dashboard-subtitle">Hola, {user?.name}</p>
        </div>
        <button className="btn-secondary" onClick={signout}>
          Cerrar sesión
        </button>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-actions">
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            + Agregar contraseña
          </button>

          <input
            type="search"
            placeholder="Buscar por título o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dashboard-search"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="dashboard-sort"
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
        </div>

        {folders.length > 0 && (
          <div className="dashboard-folders">
            <button
              className={`folder-chip ${activeFolder === null ? "active" : ""}`}
              onClick={() => setActiveFolder(null)}
            >
              Todos ({items.length})
            </button>
            {folders.map((folder) => {
              const count = items.filter(
                (i) => i.data.folder === folder,
              ).length;
              return (
                <button
                  key={folder}
                  className={`folder-chip ${activeFolder === folder ? "active" : ""}`}
                  onClick={() => setActiveFolder(folder)}
                >
                  📁 {folder} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <p className="dashboard-message">Cargando tus contraseñas...</p>
        ) : items.length === 0 ? (
          <p className="dashboard-message">
            Aún no tienes contraseñas guardadas. ¡Agrega la primera!
          </p>
        ) : filteredAndSortedItems.length === 0 ? (
          <p className="dashboard-message">No se encontraron resultados.</p>
        ) : (
          <div className="vault-grid">
            {filteredAndSortedItems.map((item) => (
              <VaultItemCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowForm(false)}>
              ×
            </button>
            <h2 className="modal-title">Nueva contraseña</h2>
            <VaultItemForm
              onSubmit={handleAddItem}
              onCancel={() => setShowForm(false)}
              existingFolders={folders}
            />
          </div>
        </div>
      )}
    </div>
  );
};
