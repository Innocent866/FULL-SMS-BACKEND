export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
};

export const errorHandler = (error, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(error);
  res.status(error.status || 500).json({ success: false, error: error.message || 'Internal Server Error' });
};
