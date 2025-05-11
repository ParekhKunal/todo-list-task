'use strict';

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { environment } = require('../../config/environment');
const { AppError } = require('../exceptions/app-error');
const userRepository = require('../../api/users/repositories/user-repository');

/**
 * Authentication middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // 1) Check if token exists
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Not authenticated. Please log in', StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    // 2) Verify token
    const decoded = jwt.verify(token, environment.jwt.secret);

    // 3) Check if user still exists
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new AppError(
        'The user belonging to this token no longer exists',
        StatusCodes.UNAUTHORIZED
      );
    }

    // 4) Grant access to protected route
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again', StatusCodes.UNAUTHORIZED));
    }
    if (error.name === 'TokenExpiredError') {
      return next(
        new AppError('Your token has expired. Please log in again', StatusCodes.UNAUTHORIZED)
      );
    }
    next(error);
  }
};

module.exports = { authenticate };
