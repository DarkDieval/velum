const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
