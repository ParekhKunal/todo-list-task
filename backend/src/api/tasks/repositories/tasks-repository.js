'use strict';

const Task = require('../models/tasks-model');

const findAll = async (userId) => {
  const query = userId ? { createdBy: userId } : {};
  return await Task.find(query)
    .populate('status')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};

const findById = async (id) => {
  return await Task.findById(id)
    .populate('status')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};

const create = async (data) => {
  console.log(data);

  const task = new Task(data);
  return await task.save();
};

const update = async (id, data) => {
  return await Task.findByIdAndUpdate(id, data, { new: true })
    .populate('status')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');
};

const deleteTask = async (id) => {
  return await Task.findByIdAndDelete(id);
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteTask,
};
