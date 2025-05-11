'use strict';

const { StatusCodes } = require('http-status-codes');
const userService = require('../services/user-service');
const { validationResult } = require('express-validator');
const { AppError } = require('../../../common/exceptions/app-error.js');
const { logger } = require('../../../common/utils/logger.js');

/**
 * Create user (Sign Up)
 */
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation error',
      errors: errors.array(),
    });
  }
  try {
    const user = await userService.createUser(req.body);
    return res.status(StatusCodes.CREATED).json({
      status: 'success',
      data: user.data,
      message: user.message,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message || 'An error occurred while creating the user',
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Email and password are required',
    });
  }

  try {
    const result = await userService.loginUser(email, password);

    if (!result.success) {
      return res.status(result.statusCode).json({
        status: 'error',
        message: result.message,
      });
    }

    return res.status(result.statusCode).json({
      status: 'success',
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: error.message || 'Invalid credentials',
    });
  }
};

/**
 * Get user profile (logged in user)
 */
const getProfile = async (req, res) => {};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {};

/**
 * Get all users (admin only)
 */
const getAllUsers = async (req, res) => {};

/**
 * Get user by ID (admin only)
 */
const getUserById = async (req, res) => {};

/**
 * Delete user by ID
 */
const deleteUser = async (req, res) => {};

module.exports = {
  createUser,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
};
