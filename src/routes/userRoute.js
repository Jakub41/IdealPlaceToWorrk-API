/* eslint-disable arrow-parens */
import { Router } from 'express';
import UserController from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);

  route.get('/user', UserController.UserCtrl.getAll);
  route.post('/user', UserController.UserCtrl.createNew);
};
