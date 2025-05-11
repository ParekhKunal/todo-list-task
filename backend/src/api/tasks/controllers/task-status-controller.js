'use strict';

const { StatusCodes } = require('http-status-codes');
const taskStatusService = require('../services/task-status-service.js');
const { validationResult } = require('express-validator');
const { AppError } = require('../../../common/exceptions/app-error.js');
const { logger } = require('../../../common/utils/logger.js');

/**
 * Get all task statuses
 */
const getAllTaskStatuses = async (req, res) => {
  try {
    const result = await taskStatusService.getAllTaskStatuses();
    return res.status(result.statusCode).json({
      status: result.success ? 'success' : 'error',
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    logger.error('Error in getAllTaskStatuses controller:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: error.message || 'Failed to retrieve task statuses',
    });
  }
};

module.exports = {
  getAllTaskStatuses,
};
