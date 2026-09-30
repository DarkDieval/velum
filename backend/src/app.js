const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const vaultRoutes = require('./routes/vaultRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Velum API funcionando' });
});

app.use(errorHandler);

module.exports = app;
