/**
 * Global error handling middleware
 * Handles different types of errors and returns appropriate responses
 */

/**
 * Handle Mongoose validation errors
 * @param {Error} error - Mongoose validation error
 * @returns {Object} Formatted error response
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => ({
    field: err.path,
    message: err.message,
    value: err.value
  }));

  return {
    error: 'Validation Error',
    message: 'Invalid input data',
    details: errors
  };
};

/**
 * Handle Mongoose duplicate key errors
 * @param {Error} error - Mongoose duplicate key error
 * @returns {Object} Formatted error response
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return {
    error: 'Duplicate Entry',
    message: `${field} '${value}' already exists`,
    field: field,
    value: value
  };
};

/**
 * Handle JWT errors
 * @param {Error} error - JWT error
 * @returns {Object} Formatted error response
 */
const handleJWTError = (error) => {
  if (error.name === 'TokenExpiredError') {
    return {
      error: 'Token Expired',
      message: 'Your session has expired. Please sign in again.'
    };
  } else if (error.name === 'JsonWebTokenError') {
    return {
      error: 'Invalid Token',
      message: 'Invalid authentication token'
    };
  } else {
    return {
      error: 'Authentication Error',
      message: 'Token verification failed'
    };
  }
};

/**
 * Handle Google OAuth errors
 * @param {Error} error - Google OAuth error
 * @returns {Object} Formatted error response
 */
const handleGoogleAuthError = (error) => {
  if (error.message.includes('Token used too early')) {
    return {
      error: 'Token Timing Error',
      message: 'Token used too early. Please try again.'
    };
  } else if (error.message.includes('Token used too late')) {
    return {
      error: 'Token Expired',
      message: 'Google token has expired. Please sign in again.'
    };
  } else if (error.message.includes('Invalid token signature')) {
    return {
      error: 'Invalid Token',
      message: 'Invalid Google authentication token'
    };
  } else {
    return {
      error: 'Google Authentication Error',
      message: 'Failed to verify Google token'
    };
  }
};

/**
 * Main error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      error: 'Not Found',
      message: message
    };
    return res.status(404).json(error);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errorResponse = handleValidationError(err);
    return res.status(400).json(errorResponse);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const errorResponse = handleDuplicateKeyError(err);
    return res.status(409).json(errorResponse);
  }

  // JWT errors
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
    const errorResponse = handleJWTError(err);
    return res.status(401).json(errorResponse);
  }

  // Google OAuth errors
  if (err.message.includes('Google token verification failed') || 
      err.message.includes('Token used too early') ||
      err.message.includes('Token used too late') ||
      err.message.includes('Invalid token signature')) {
    const errorResponse = handleGoogleAuthError(err);
    return res.status(401).json(errorResponse);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 handler for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler,
  handleValidationError,
  handleDuplicateKeyError,
  handleJWTError,
  handleGoogleAuthError
};
