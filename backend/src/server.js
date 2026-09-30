const app = require('./app');
const connectDB = require('./config/db');
const { validateEnv } = require('./config/env');

const PORT = process.env.PORT || 3000;

validateEnv();
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor Velum corriendo en puerto ${PORT}`);
});
