'use strict';

const { body } = require('express-validator');

const userValidation = {
  login: [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email').optional().isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[a-zA-Z]/)
      .withMessage('Password must contain at least one letter'),
  ],
};

module.exports = { userValidation };
