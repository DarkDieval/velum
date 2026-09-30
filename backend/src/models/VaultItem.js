const mongoose = require('mongoose');

const vaultItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('VaultItem', vaultItemSchema);
