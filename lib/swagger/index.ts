import swaggerUi = require('swagger-ui-express');
import swaggerJSDoc = require('swagger-jsdoc');
import { options } from '../config/swagger.config';

export class Swagger {

  createSwagger(app) {
    const swaggerSpec = swaggerJSDoc(options)
    app.get('/swagger.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(this.swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
}