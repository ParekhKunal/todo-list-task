'use strict';

const { AppError } = require('../../../common/exceptions/app-error.js');
const taskRepository = require('../repositories/tasks-repository.js');
const { StatusCodes } = require('http-status-codes');

const getAllTasks = async (userId) => {
  return await taskRepository.findAll(userId);
};

const createTask = async (taskData) => {
  // You can add any business logic/validation here
  if (!taskData.title || !taskData.description || !taskData.dueDate || !taskData.status) {
    throw new AppError('Missing required fields', StatusCodes.BAD_REQUEST);
  }
  return await taskRepository.create(taskData);
};

const updateTask = async (id, updateData) => {
  const existingTask = await taskRepository.findById(id);
  if (!existingTask) {
    throw new AppError('Task not found', StatusCodes.NOT_FOUND);
  }

  return await taskRepository.update(id, updateData);
};

const deleteTask = async (id) => {
  const existingTask = await taskRepository.findById(id);
  if (!existingTask) {
    throw new AppError('Task not found', StatusCodes.NOT_FOUND);
  }

  return await taskRepository.delete(id);
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
