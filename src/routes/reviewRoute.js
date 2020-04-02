import { Router } from 'express';
import passport from 'passport';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);
  app.use(passport.initialize());

  app.get('/reviews', Controller.ReviewCtrl.getAllReviews);
  app.get(
    '/reviewsForPerson/:userId',
    Controller.ReviewCtrl.getReviewBySpecificUser,
  );
  app.get(
    '/reviewsForPlace/:placeId',
    Controller.ReviewCtrl.getReviewForSpecificPlace,
  );
  app.post(
    '/reviews/:placeId',
    passport.authenticate('jwt'),
    Controller.ReviewCtrl.postNewReview,
  );
  app.patch(
    '/reviews/:placeId/:reviewId',
    passport.authenticate('jwt'),
    Controller.ReviewCtrl.updateReview,
  );
  app.delete(
    '/reviews/:placeId/:reviewId',
    passport.authenticate('jwt'),
    Controller.ReviewCtrl.deleteReview,
  );
};
