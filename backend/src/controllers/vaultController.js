const VaultItem = require('../models/VaultItem');

const getVaultItems = async (req, res, next) => {
  try {
    const items = await VaultItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const createVaultItem = async (req, res, next) => {
  try {
    const { encryptedData, iv } = req.body;

    if (!encryptedData || !iv) {
      return res.status(400).json({ message: 'Faltan datos cifrados' });
    }

    const item = await VaultItem.create({
      user: req.user._id,
      encryptedData,
      iv,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const deleteVaultItem = async (req, res, next) => {
  try {
    const item = await VaultItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Elemento no encontrado' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await item.deleteOne();
    res.json({ message: 'Elemento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getVaultItems, createVaultItem, deleteVaultItem };
