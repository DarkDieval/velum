import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getVaultItems,
  createVaultItem,
  deleteVaultItem,
  type VaultItemEncrypted,
  type VaultItemDecrypted,
  type VaultItemData,
} from '../api/vault';
import { encryptData, decryptData } from '../crypto/crypto';
import { VaultItemForm } from './VaultItemForm';
import { VaultItemCard } from './VaultItemCard';
import './Dashboard.css';

export const Dashboard = () => {
  const { user, token, derivedKey, signout } = useAuth();
  const [items, setItems] = useState<VaultItemDecrypted[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

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
              item.iv
            );
            return { ...item, data };
          } catch {
            return {
              ...item,
              data: { title: '⚠️ No se pudo descifrar', username: '', password: '' },
            };
          }
        })
      );
      setItems(decrypted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, derivedKey]);

  useEffect(() => {
    loadItems();
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
    if (!confirm('¿Seguro que quieres eliminar este item?')) return;
    await deleteVaultItem(token, id);
    await loadItems();
  };

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
        </div>

        {loading ? (
          <p className="dashboard-message">Cargando tus contraseñas...</p>
        ) : items.length === 0 ? (
          <p className="dashboard-message">
            Aún no tienes contraseñas guardadas. ¡Agrega la primera!
          </p>
        ) : (
          <div className="vault-grid">
            {items.map((item) => (
              <VaultItemCard key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="modal-overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setShowForm(false);
        }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            <h2 className="modal-title">Nueva contraseña</h2>
            <VaultItemForm onSubmit={handleAddItem} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};