const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DOCSCIVIL API',
      version: '1.0.0',
      description: 'API de docscivil ci'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Serveur de développement'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
