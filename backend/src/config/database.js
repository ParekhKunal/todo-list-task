'use strict';

const mongoose = require('mongoose');
const { environment } = require('./environment');
const { logger } = require('../common/utils/logger');
const { initializeDefaultStatuses } = require('../api/tasks/models/task-status-model');

// MongoDB connection string
// const dbURI = process.env.DB_URI || `mongodb://${environment.db.host}:${environment.db.port}/${environment.db.database}`;
const dbURI =
  process.env.DB_URI ||
  `mongodb://${environment.db.host}:${environment.db.port}/${environment.db.database}`;

// Test MongoDB connection
const testConnection = async () => {
  try {
    await mongoose.connect(dbURI);
    logger.info('MongoDB database connection established successfully');

    // Initialize task statuses after successful connection
    await initializeDefaultStatuses();
    logger.info('Task statuses initialized successfully');

    return true;
  } catch (error) {
    logger.error('MongoDB database connection failed', error);
    throw error;
  }
};

// Helper function to execute queries
const executeQuery = async (Model, query = {}, projection = {}, options = {}) => {
  try {
    const result = await Model.find(query, projection, options);
    return result;
  } catch (error) {
    logger.error(`Database query error: ${error.message}`, { query });
    throw error;
  }
};

module.exports = {
  testConnection,
  executeQuery,
};
