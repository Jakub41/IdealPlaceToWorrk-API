import { Router } from 'express';
import Controller from '../controllers';

const route = Router();

export default (app) => {
  app.use('/', route);

  app.get('/reviews', Controller.ReviewCtrl.getAllReviews);

  app.get('/reviews/:userId', Controller.ReviewCtrl.getAllUserReviews);

  app.get('/reviews/:placeId', Controller.ReviewCtrl.getAllPlaceReviews);

  app.post('/reviews/:placeId', Controller.ReviewCtrl.createReview);

  app.patch('/reviews/:reviewId', Controller.ReviewCtrl.editUserReview);

  app.delete('/reviews/:reviewId', Controller.ReviewCtrl.deleteReview);
};
