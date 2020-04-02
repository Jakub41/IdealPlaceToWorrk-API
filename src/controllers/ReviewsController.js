/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
import Logger from '../loaders/logger';
// eslint-disable-next-line import/named
import DB from '../models';
import { AvgCalc } from '../helpers';

const ReviewsController = {
  async getAllReviews(req, res, next) {
    try {
      const reviews = await DB.Review.find({});
      if (reviews) {
        return res.status(200).json(reviews);
      }
      return res.status(400).json('No reviews found');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async getReviewBySpecificUser(req, res, next) {
    try {
      const reviews = await DB.Review.find({ UserId: req.params.userId });
      if (reviews) {
        return res.status(200).json(reviews);
      }
      return res.status(404).json('No user found');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async getReviewForSpecificPlace(req, res, next) {
    try {
      const reviews = await DB.Review.find({ PlaceId: req.params.placeId }).populate('UserId');
      if (reviews) {
        return res.status(200).json(reviews);
      }
      return res.status(404).send('not found');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async postNewReview(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const userId = req.user._id.toString();
      const incomingData = {
        ...req.body,
        UserId: userId,
        PlaceId: req.params.placeId,
      };
      // RateAverage, GoodService, WifiRate,  QuitePlace
      const review = await DB.Review.create(incomingData);
      if (review) {
        const place = await DB.Place.findByIdAndUpdate(
          req.params.placeId,
          {
            $push: { Reviews: review },
          },
          { new: true },
        );

        place.RateAverage = await AvgCalc(review.Rating, place.RateAverage);

        place.GoodService = await AvgCalc(
          review.GoodService,
          place.GoodService,
        );

        place.QuitePlace = await AvgCalc(review.QuitePlace, place.QuitePlace);

        place.WifiRate = await AvgCalc(review.WifiRate, place.WifiRate);

        place.save();

        if (place) {
          return res.status(200).send('Everything was updated successfully');
        }
        return res.status(500).send('Places was not updated');
      }
      return res.status(404).json('Not authorized');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async updateReview(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const userId = req.user._id;
      const reviewData = await DB.Review.findById(req.params.reviewId);
      const incomingData = req.body;
      if (reviewData.UserId.equals(userId)) {
        const update = await DB.Review.findByIdAndUpdate(
          req.params.reviewId,
          incomingData,
          { new: true },
        );
        if (update) {
          return res.status(200).json(update);
        }
        return res.status(404).json('review not found');
      }
      return res.status(404).json('Not authorised');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
  async deleteReview(req, res, next) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      const userId = req.user._id.toString();
      const review = await DB.Review.findById(req.params.reviewId);
      if (review.userId === userId) {
        const removed = await DB.Review.findByIdAndRemove(req.params.reviewId);
        await DB.Place.findByIdAndUpdate(req.params.placeId, {
          $pull: { Reviews: { _id: req.params.reviewId } },
        });
        if (removed) {
          return res.status(200).json('Removed');
        }
        return res.status(404).json('Review not found');
      }
      return res.status(401).json('not authorised');
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default ReviewsController;
