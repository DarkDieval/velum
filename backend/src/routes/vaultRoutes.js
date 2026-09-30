const express = require('express');
const {
  getVaultItems,
  createVaultItem,
  deleteVaultItem,
} = require('../controllers/vaultController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de /api/vault están protegidas por JWT
router.use(protect);

router.get('/', getVaultItems);
router.post('/', createVaultItem);
router.delete('/:id', deleteVaultItem);

module.exports = router;
