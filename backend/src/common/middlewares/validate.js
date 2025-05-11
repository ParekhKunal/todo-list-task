'use strict';

const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

/**
 * Middleware for request validation
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  };
};

module.exports = { validate };
