'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { environment } = require('../../../config/environment.js');
const { AppError } = require('../../../common/exceptions/app-error.js');
const userRepository = require('../repositories/user-repository.js');

/**
 * Create a new user
 */
const createUser = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    return {
      success: false,
      message: 'User with this email already exists',
      statusCode: StatusCodes.CONFLICT,
    };
  }

  const newUser = {
    ...userData,
    role: 'USR',
    isActive: true,
  };

  const createdUser = await userRepository.create(newUser);
  const token = generateToken(createdUser);

  return {
    success: true,
    data: {
      user: sanitizeUser(createdUser),
      token,
    },
    message: 'User registered successfully',
    statusCode: StatusCodes.CREATED,
  };
};

/**
 * Login user with email and password
 */
const loginUser = async (email, password) => {
  const user = await userRepository.findByEmail(email);

  if (!user || !user.isActive) {
    return {
      success: false,
      message: 'Invalid credentials or account disabled',
      statusCode: StatusCodes.UNAUTHORIZED,
    };
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return {
      success: false,
      message: 'Incorrect password',
      statusCode: StatusCodes.UNAUTHORIZED,
    };
  }

  const token = generateToken(user);
  return {
    success: true,
    data: {
      user: sanitizeUser(user),
      token,
    },
    message: 'Login successful',
    statusCode: StatusCodes.OK,
  };
};

/**
 * Get all users
 */
const getAllUsers = async () => {};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {};

/**
 * Update user
 */
const updateUser = async (userId, userData) => {};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, environment.jwt.secret, {
    expiresIn: environment.jwt.expiresIn,
  });
};

/**
 * Remove sensitive data from user object
 */
const sanitizeUser = (user) => {
  const sanitized = user.toObject ? user.toObject() : { ...user };

  // Remove sensitive fields
  delete sanitized.password;
  delete sanitized.__v;
  delete sanitized._id;
  delete sanitized.isActive;
  delete sanitized.phoneNumber;
  delete sanitized.profilePicture;
  delete sanitized.role;
  delete sanitized.createdAt;
  delete sanitized.updatedAt;
  delete sanitized.bio;

  return sanitized;
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
};
