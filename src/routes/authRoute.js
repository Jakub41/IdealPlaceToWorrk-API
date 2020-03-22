import { Router } from 'express';
import passport from 'passport';
import auth from '../config/auth';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.post('/user/register', Controller.AuthCtrl.registerUser);
  app.post(
    '/user/login',
    auth.basic,
    auth.setUserInfo,
    Controller.AuthCtrl.loginUser,
  );
  app.post(
    '/user/refresh',
    passport.authenticate('jwt'),
    Controller.AuthCtrl.refreshToken,
  );
};
