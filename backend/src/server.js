'use strict';

require('dotenv').config(); // Load environment variables from a .env file
const app = require('./app');
const { logger } = require('./common/utils/logger');
const { environment } = require('./config/environment');
const { testConnection } = require('./config/database'); // Import testConnection from database.js

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception. Shutting down...', err);
  process.exit(1);
});

// Test MongoDB connection before starting the server
const initializeDatabase = async () => {
  try {
    await testConnection(); // Ensure DB connection is successful
  } catch (err) {
    logger.error('Failed to establish database connection. Exiting...', err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Start the server only after database connection is established
const startServer = async () => {
  try {
    await initializeDatabase();

    const PORT = environment.port || 3000;
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${environment.nodeEnv} mode`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection. Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown for SIGTERM (used by cloud platforms like Heroku)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated gracefully');
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
