const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Error interno del servidor' : err.message;

  res.status(status).json({ message });
};

module.exports = errorHandler;
