'use strict';

const express = require('express');
const { body, param } = require('express-validator');
const taskStatusController = require('../controllers/task-status-controller');
const { validate } = require('../../../common/middlewares/validate');
const { authenticate } = require('../../../common/middlewares/authenticate');

const router = express.Router();

// Validation rules
const statusValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isIn(['Pending', 'Completed'])
    .withMessage('Name must be either Pending or Completed'),
  body('statusCode')
    .trim()
    .notEmpty()
    .withMessage('Status code is required')
    .isIn(['PEND', 'COMP'])
    .withMessage('Status code must be either PEND or COMP'),
];

const idValidationRule = [param('id').isMongoId().withMessage('Invalid task status ID')];

router.get('/', taskStatusController.getAllTaskStatuses);

module.exports = router;
