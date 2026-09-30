const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`❌ Faltan variables de entorno requeridas: ${missing.join(', ')}`);
    process.exit(1);
  }
};

module.exports = { validateEnv };
