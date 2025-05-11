'use strict';

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { version } = require('../../package.json');
const { environment } = require('../config/environment');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Documentation',
      version,
      description: 'API documentation for the Express application',
      license: {
        name: 'Kunal Parekh - MedsCred',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `${environment.url}:${environment.port}${environment.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/api/**/*.js', './src/docs/*.yml'],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = { setupSwagger };
