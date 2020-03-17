/* eslint-disable arrow-parens */
import { Router } from 'express';
import TestController from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);

  route.get('/test/:id', TestController.TestCtrl.getAll);
};
