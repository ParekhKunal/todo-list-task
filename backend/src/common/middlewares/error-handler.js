'use strict';

const { StatusCodes } = require('http-status-codes');
const { logger } = require('../utils/logger');
const { environment } = require('../../config/environment');
const { AppError } = require('../exceptions/app-error');

const errorHandler = (err, _req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Handle specific errors
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, StatusCodes.BAD_REQUEST);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(
      `Duplicate field value: ${field}. Please use another value`,
      StatusCodes.CONFLICT
    );
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    error = new AppError(`Validation failed: ${errors.join(', ')}`, StatusCodes.BAD_REQUEST);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again', StatusCodes.UNAUTHORIZED);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired. Please log in again', StatusCodes.UNAUTHORIZED);
  }

  // Development error response
  if (environment.nodeEnv === 'development') {
    return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message || 'Something went wrong',
      error: err,
      stack: error.stack,
    });
  }

  // Production error response
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  // Unknown error - don't leak error details
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

module.exports = { errorHandler };
