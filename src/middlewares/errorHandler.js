// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'fail',
    message,
  });
};

module.exports = errorHandler;
