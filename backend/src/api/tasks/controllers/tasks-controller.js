'use strict';

const { StatusCodes } = require('http-status-codes');
const taskService = require('../services/tasks-service.js');
const { validationResult } = require('express-validator');
const { AppError } = require('../../../common/exceptions/app-error.js');
const { logger } = require('../../../common/utils/logger.js');

const getAllTasks = async (req, res) => {
  try {
    const userId = req.user?.id;
    const tasks = await taskService.getAllTasks(userId);

    if (tasks.length == 0) {
      return res
        .status(StatusCodes.OK)
        .json({ status: 'success', data: tasks, message: 'No Task Found!' });
    }

    return res.status(StatusCodes.OK).json({ status: 'success', data: tasks });
  } catch (error) {
    logger.error('Error fetching tasks:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: error.message });
  }
};

const createTasks = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new AppError('Validation failed', StatusCodes.BAD_REQUEST);

    console.log(req.body);

    const taskData = {
      ...req.body,
      // createdBy: req.user.id,
      createdBy: '681ece3700114f94030c7f2e',
    };

    const newTask = await taskService.createTask(taskData);
    return res.status(StatusCodes.CREATED).json({ status: 'success', data: newTask });
  } catch (error) {
    logger.error('Error creating task:', error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: error.message });
  }
};

const updateTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await taskService.updateTask(id, req.body);
    return res.status(StatusCodes.OK).json({ status: 'success', data: updatedTask });
  } catch (error) {
    logger.error('Error updating task:', error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: error.message });
  }
};

const deleteTasks = async (req, res) => {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    return res
      .status(StatusCodes.OK)
      .json({ status: 'success', message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Error deleting task:', error);
    return res
      .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTasks,
  updateTasks,
  deleteTasks,
};
