import { Router } from 'express';
import passport from 'passport';
import Controller from '../controllers';
import Redis from '../middleware';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.get('/users', Redis.cache.get_All, Controller.UserCtrl.getAllUsers);
  app.get(
    '/users/me',
    passport.authenticate('jwt'),
    Controller.UserCtrl.getMyself,
  );
  app.get(
    '/users/:userId',
    Redis.cache.get_Specific_Data,
    Controller.UserCtrl.getSpecificUser,
  );
  app.patch(
    '/users/:userId',
    passport.authenticate('jwt'),
    Controller.UserCtrl.updateUser,
  );
  app.delete(
    '/users/:userId',
    Redis.cache.get_Delete_Data,
    passport.authenticate('jwt'),
    Controller.UserCtrl.deleteUser,
  );
  app.post('/users/emailverification', Controller.UserCtrl.verifyEmail);
  app.post('/users/resetpassword/:emailToken', Controller.UserCtrl.updateUser);
};
