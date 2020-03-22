/* eslint-disable arrow-parens */
import { Router } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';

const route = Router();

export default (app) => {
  app.use('/', route);

  route.get('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
