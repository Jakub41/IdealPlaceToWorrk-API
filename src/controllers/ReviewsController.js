/* eslint-disable no-underscore-dangle */
/* eslint-disable operator-linebreak */
import Logger from '../loaders/logger';
// eslint-disable-next-line import/named
import DB from '../models';
import { AvgCalc, FilterHelper } from '../helpers';

const ReviewsController = {
  async getAllReviews(req, res, next) {
    try {
      const reviews = await FilterHelper.filter(req, 'reviews').then(
        (response) => response,
      );
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
      const { limit, skip } = req.query;
      const total = await DB.Review.find({PlaceId: req.params.placeId })
      const reviews = await DB.Review.find({PlaceId: req.params.placeId }).populate('UserId').limit(parseInt(limit)).skip(parseInt(skip)); 
      if (reviews) {
        return res.status(200).json({ reviews, total: total.length });
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
        Author: `${req.user.firstname} ${req.user.lastname}`,
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
      const { placeId, reviewId } = req.params;
      const userId = req.user._id.toString();
      const reviewData = await DB.Review.findById(reviewId);
      const incomingData = req.body;
      const updateRating = {};

      if (reviewData.UserId.equals(userId)) {
        const update = await DB.Review.findByIdAndUpdate(
          reviewId,
          incomingData,
          { new: true },
        );

        // update place's Review[] first
        const updatePlaceRating = await DB.Place.updateOne(
          {
            Reviews: {
              $elemMatch: {
                _id: reviewId,
              },
            },
          },
          {
            $set: {
              'Reviews.$.Rating': incomingData.Rating,
              'Reviews.$.GoodService': incomingData.GoodService,
              'Reviews.$.QuitePlace': incomingData.QuitePlace,
              'Reviews.$.WifiRate': incomingData.WifiRate,
              'Reviews.$.Text': incomingData.Text,
            },
          },
        );

        const updatedPlaceData = await DB.Place.findById(placeId);
        const updatedReviewData = updatedPlaceData.Reviews;

        let rateAverage = 0;
        let goodService = 0;
        let quitePlace = 0;
        let wifiRate = 0;

        for (let i = 0; i < updatedReviewData.length; i += 1) {
          rateAverage += updatedReviewData[i].Rating;
          goodService += updatedReviewData[i].GoodService;
          quitePlace += updatedReviewData[i].QuitePlace;
          wifiRate += updatedReviewData[i].WifiRate;
        }

        // calculate now place params
        updateRating.RateAverage =
          updatedReviewData.length > 0
            ? Math.floor((rateAverage / updatedReviewData.length) * 100) / 100
            : 0;

        updateRating.GoodService =
          updatedReviewData.length > 0
            ? Math.floor((goodService / updatedReviewData.length) * 100) / 100
            : 0;

        updateRating.QuitePlace =
          updatedReviewData.length > 0
            ? Math.floor((quitePlace / updatedReviewData.length) * 100) / 100
            : 0;

        updateRating.WifiRate =
          updatedReviewData.length > 0
            ? Math.floor((wifiRate / updatedReviewData.length) * 100) / 100
            : 0;

        updateRating.Text = incomingData.Text;

        // Now update place params for rating
        const updatePlace = await DB.Place.findByIdAndUpdate(
          placeId,
          updateRating,
          { new: true },
        );

        if (!updatePlaceRating || !updatePlace || !update) {
          Logger.error('Update error');
          return res.status(500).json('Update error');
        }

        Logger.info('Update success');
        return res.status(200).json(update);
      }
      Logger.error('Not authorized');
      return res.status(404).json('Not authorized');
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
      if (review.UserId.equals(userId)) {
        const removed = await DB.Review.findByIdAndRemove(req.params.reviewId);

        // update place's Review[] first
        const removePlaceRating = await DB.Place.updateOne(
          {
            Reviews: {
              $elemMatch: {
                _id: req.params.reviewId,
              },
            },
          },
          {
            $pull: { Reviews: { _id: req.params.reviewId } },
          },
        );

        const updatedPlaceData = await DB.Place.findById(req.params.placeId);
        const updatedReviewData = updatedPlaceData.Reviews;
        let rateAverage = 0;
        let goodService = 0;
        let quitePlace = 0;
        let wifiRate = 0;
        for (let i = 0; i < updatedReviewData.length; i += 1) {
          rateAverage += updatedReviewData[i].Rating;
          goodService += updatedReviewData[i].GoodService;
          quitePlace += updatedReviewData[i].QuitePlace;
          wifiRate += updatedReviewData[i].WifiRate;
        }
        const updateRating = {};
        // calculate now place params
        updateRating.RateAverage =
          updatedReviewData.length > 0
            ? rateAverage / updatedReviewData.length
            : 0;

        updateRating.GoodService =
          updatedReviewData.length > 0
            ? goodService / updatedReviewData.length
            : 0;

        updateRating.QuitePlace =
          updatedReviewData.length > 0
            ? quitePlace / updatedReviewData.length
            : 0;

        updateRating.WifiRate =
          updatedReviewData.length > 0
            ? wifiRate / updatedReviewData.length
            : 0;

        // Now update place params for rating
        const updatePlace = await DB.Place.findByIdAndUpdate(
          req.params.placeId,
          updateRating,
          { new: true },
        );

        if (removed && removePlaceRating && updatePlace) {
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
