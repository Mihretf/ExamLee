const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExamLee API',
      version: '1.0.0',
      description: 'Documentation for the ExamLee academic resource platform.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
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
  },
  // This tells Swagger where to look for the @openapi comments
  apis: ['./docs/*.yml'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;