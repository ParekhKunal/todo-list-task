'use strict';

const mongoose = require('mongoose');

const taskStatus = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed'],
      trim: true,
    },
    statusCode: {
      type: String,
      required: true,
      enum: ['PEND', 'COMP'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
taskStatus.index({ name: 1, statusCode: 1 }, { unique: true });

const taskStatuses = mongoose.model('taskStatus', taskStatus);

// Initialize default statuses if they don't exist
const initializeDefaultStatuses = async () => {
  try {
    const defaultStatuses = [
      { name: 'Pending', statusCode: 'PEND' },
      { name: 'Completed', statusCode: 'COMP' },
    ];

    for (const status of defaultStatuses) {
      await taskStatuses.findOneAndUpdate({ statusCode: status.statusCode }, status, {
        upsert: true,
        new: true,
      });
    }
    console.log('Task statuses initialized successfully');
  } catch (error) {
    console.error('Error initializing default task statuses:', error);
    throw error; // Re-throw the error to handle it in the application
  }
};

// Export both the model and the initialization function
module.exports = {
  taskStatuses,
  initializeDefaultStatuses,
};
