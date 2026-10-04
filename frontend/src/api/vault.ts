export interface VaultItemEncrypted {
  _id: string;
  user: string;
  encryptedData: string;
  iv: string;
  createdAt: string;
}

export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  folder?: string;
}

export interface VaultItemDecrypted extends VaultItemEncrypted {
  data: VaultItemData;
}

const API_URL = "/api/vault";

export const getVaultItems = async (
  token: string,
): Promise<VaultItemEncrypted[]> => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Error al obtener los items");
  return result;
};

export const createVaultItem = async (
  token: string,
  encryptedData: string,
  iv: string,
): Promise<VaultItemEncrypted> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ encryptedData, iv }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Error al guardar");
  return result;
};

export const deleteVaultItem = async (
  token: string,
  id: string,
): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Error al eliminar");
};
