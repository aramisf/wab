// errorHandler has a signature of a regular express middleware
const errorHandlerMiddleware = function (err, req, res, next) {
  if (err && !err.statusCode) err.statusCode = 500

  res.status(err.statusCode).json({
    type: 'error',
    msg: err.message,
  });

  if (!err) next();
};

module.exports = errorHandlerMiddleware;

