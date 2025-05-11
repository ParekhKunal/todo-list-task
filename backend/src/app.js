'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { StatusCodes } = require('http-status-codes');
require('express-async-errors');

const { environment } = require('./config/environment');
const { logger, morganStream } = require('./common/utils/logger');
const { errorHandler } = require('./common/middlewares/error-handler');
const { rateLimiter } = require('./common/middlewares/rate-limiter');
const { setupSwagger } = require('./docs/swagger');
const routes = require('./api');

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors());
app.use(rateLimiter);

// Body parsers
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Gzip compression
app.use(compression());

// Request logging
if (environment.nodeEnv !== 'test') {
  app.use(morgan(environment.logFormat, { stream: morganStream }));
}

// API Documentation
if (environment.nodeEnv !== 'production') {
  setupSwagger(app);
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Server is healthy',
  });
});

// API routes
app.use(environment.apiPrefix, routes);

// 404 handler
app.use((_req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'error',
    message: 'Resource not found',
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
