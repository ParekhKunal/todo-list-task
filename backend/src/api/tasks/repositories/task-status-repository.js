'use strict';

const { taskStatuses } = require('../models/task-status-model');
const { logger } = require('../../../common/utils/logger');

/**
 * Get all task statuses
 */
const findAll = async () => {
  try {
    return await taskStatuses.find().sort({ createdAt: 1 });
  } catch (error) {
    logger.error('Error in findAll task statuses:', error);
    throw error;
  }
};

module.exports = {
  findAll,
};
