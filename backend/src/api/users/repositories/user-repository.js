'use strict';

const mongoose = require('mongoose');
const { logger } = require('../../../common/utils/logger.js');
const { executeQuery } = require('../../../config/database');
const User = require('../models/user-models.js');

const create = async (userData) => {
  try {
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      const customError = new Error(
        `Duplicate field: ${field} with value '${value}' already exists.`
      );
      customError.statusCode = 409; // Conflict
      throw customError;
    }

    const generalError = new Error('Failed to create user: ' + error.message);
    generalError.statusCode = 500;
    throw generalError;
  }
};

/**
 * Find user by ID
 */
const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await User.findById(id).exec();
};

/**
 * Find user by email
 */
const findByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = {
  create,
  findByEmail,
  findById,
};
