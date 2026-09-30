const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  // El "blob" cifrado. Contiene todo lo que el usuario quiere guardar
  // (título, usuario, contraseña, notas), pero cifrado con AES-GCM.
  encryptedData: {
    type: String,
    required: true,
  },
  // Vector de inicialización (IV), necesario para descifrar. No es secreto,
  // pero es único por cada operación de cifrado.
  iv: {
    type: String,
    required: true,
  },
  // Sal utilizada para derivar la clave con PBKDF2. También es única por usuario.
  salt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VaultItem', vaultItemSchema);
