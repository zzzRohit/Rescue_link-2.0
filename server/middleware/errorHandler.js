export const errorHandler = (err, _req, res, _next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return res.status(409).json({ message: `${field} is already registered` });
  }

  if ((err.status || 500) >= 500) {
    console.error(err);
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
};
