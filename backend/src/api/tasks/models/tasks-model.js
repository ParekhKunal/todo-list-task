'use strict';

const mongoose = require('mongoose');
const { taskStatuses } = require('./task-status-model');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    dueDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'Due date must be in the future',
      },
    },
    status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'taskStatus',
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });

// Add a method to check if task is overdue
taskSchema.methods.isOverdue = function () {
  return this.dueDate < new Date() && this.status.statusCode !== 'COMP';
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
