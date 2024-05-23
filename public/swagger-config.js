const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Notas',
      version: '1.0.0',
      description: 'Una API para gestionar notas',
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Rutas de tu API que deseas documentar
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
