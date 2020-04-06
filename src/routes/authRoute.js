import { Router } from 'express';
import passport from 'passport';
import auth from '../config/auth';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.get('/auth/facebook', passport.authenticate('facebook'));
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile'] }),
  );
  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/api/v1/auth/login',
    }),
    // Controller.AuthCtrl.authRedirect,
  );
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/v1/auth/login',
    }),
    Controller.AuthCtrl.authRedirect,
  );
  app.post('/auth/register', Controller.AuthCtrl.registerUser);
  app.post('/auth/facebook', Controller.AuthCtrl.facebookLogin);
  app.post(
    '/auth/login',
    auth.basic,
    auth.setUserInfo,
    Controller.AuthCtrl.loginUser,
  );
  app.post(
    '/auth/refresh',
    passport.authenticate('jwt'),
    Controller.AuthCtrl.refreshToken,
  );
  app.get(
    '/auth/emailverification/:emailToken',
    Controller.AuthCtrl.verifyEmail,
  );
};
