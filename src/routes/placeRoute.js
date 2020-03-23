/* eslint-disable arrow-parens */
import { Router } from 'express';
import passport from 'passport';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.post(
    '/places',
    passport.authenticate('jwt'),
    Controller.PlaceCtrl.addPlace,
  );
  app.get('/places', Controller.PlaceCtrl.searchForPlaces);
  app.get('/placesFromGoogle', Controller.PlaceCtrl.getDataFromGoogle);
};
