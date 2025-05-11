'use strict';

const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../../../common/exceptions/app-error');
const taskStatusRepository = require('../repositories/task-status-repository');
const { logger } = require('../../../common/utils/logger');

/**
 * Get all task statuses
 */
const getAllTaskStatuses = async () => {
  try {
    const statuses = await taskStatusRepository.findAll();
    return {
      success: true,
      data: statuses,
      message: 'Task statuses retrieved successfully',
      statusCode: StatusCodes.OK,
    };
  } catch (error) {
    logger.error('Error in getAllTaskStatuses:', error);
    throw new AppError('Failed to retrieve task statuses', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllTaskStatuses,
};
