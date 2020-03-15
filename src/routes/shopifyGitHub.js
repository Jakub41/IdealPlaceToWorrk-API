/* eslint-disable arrow-parens */
import { Router } from 'express';
import SCtrl from '../controllers';

const route = Router();

export default app => {
  app.use('/', route);

  route.get('/repositories-commits-details', SCtrl.ShopCtrl.getAll);
};
