function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large. Maximum size is 5MB.'
        : err.message;
    return res.status(400).json({ message });
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email is already registered' });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong'
  });
}

module.exports = errorHandler;
