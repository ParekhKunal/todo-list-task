'use strict';

const rateLimit = require('express-rate-limit');
const { environment } = require('../../config/environment');

const rateLimiter = rateLimit({
  windowMs: environment.rateLimiter.windowMs,
  max: environment.rateLimiter.max,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };
