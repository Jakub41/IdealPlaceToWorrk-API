/* eslint-disable arrow-parens */
import { Router } from 'express';
import passport from 'passport';
import expressPublicIp from 'express-public-ip';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());
  app.use(expressPublicIp());

  app.get('/places', Controller.PlaceCtrl.getAll);
  app.get('/places/:placeId', Controller.PlaceCtrl.getSpecificPlace);

  app.get('/places/ratings/:placeId', Controller.PlaceCtrl.getPlaceRatings);

  app.post(
    '/places',
    passport.authenticate('jwt'),
    Controller.PlaceCtrl.addPlace,
  );
  app.patch(
    '/places/:placeId',
    passport.authenticate('jwt'),
    Controller.PlaceCtrl.updateSpecificPlace,
  );
  app.delete(
    '/places/:placeId',
    passport.authenticate('jwt'),
    Controller.PlaceCtrl.deletePlace,
  );
  app.post('/placesSearch', Controller.PlaceCtrl.findSpecificPlace);
  app.post(
    '/placesInSpecificCity',
    Controller.PlaceCtrl.findPlacesForSpecificArea,
  );
  app.post(
    '/places/handlefavourites/:placeId',
    passport.authenticate('jwt'),
    Controller.PlaceCtrl.removeAddPlacesToFavourite,
  );
};
