import { Router } from 'express';
import passport from 'passport';
import auth from '../config/auth';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.post('/register', Controller.AuthCtrl.registerUser);
  app.post(
    '/login',
    auth.basic,
    auth.setUserInfo,
    Controller.AuthCtrl.loginUser,
  );
  app.post(
    '/refresh',
    passport.authenticate('jwt'),
    Controller.AuthCtrl.refreshToken,
  );
  app.get('/emailverification/:emailToken', Controller.AuthCtrl.verifyEmail);
};
