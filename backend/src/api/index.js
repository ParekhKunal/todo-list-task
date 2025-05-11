'use strict';

const express = require('express');
const router = express.Router();
const { logger } = require('../common/utils/logger');

// Example route for testing
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working properly',
  });
});

// Register routes

// When you're ready to add user routes, uncomment this:
const usersRoutes = require('./users/routes.js');
const taskStatusRoutes = require('./tasks/routes/task-status-routes.js');
const taskRoutes = require('./tasks/routes/tasks-routes.js');

router.use('/task-status', taskStatusRoutes);
router.use('/tasks', taskRoutes);

router.use('/', usersRoutes);

module.exports = router;
