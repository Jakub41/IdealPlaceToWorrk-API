/* eslint-disable no-underscore-dangle */
import Logger from '../loaders/logger';
// eslint-disable-next-line import/named
import DB from '../models';

const ReviewController = {
  async getAllReviews(req, res, next) {
    try {
      const reviews = await DB.Review.find({});

      if (!reviews) {
        Logger.error('Reviews not found');
        return res.status(404).json('Reviews not found');
      }
      Logger.info('Reviews Found');
      return res.status(200).json(reviews);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async getAllUserReviews(req, res, next) {
    try {
      const reviews = await DB.Review.find({ userId: req.params.userId });
      if (!reviews) {
        Logger.error('Reviews not found');
        return res.status(404).json('Reviews not found');
      }
      Logger.info('User reviews found');
      return res.status(200).json(reviews);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async getAllPlaceReviews(req, res, next) {
    try {
      const reviews = await DB.Review.find({ placeId: req.params.placeId });
      if (!reviews) {
        Logger.error('Reviews not found');
        return res.status(404).json('Reviews not found');
      }
      Logger.info('Reviews on place found');
      return res.status(200).json(reviews);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async createReview(req, res, next) {
    try {
      const incomingData = {
        ...req.body,
        userId: req.user._id,
        placeId: req.params.placeId,
      };
      const review = await DB.Review.create(incomingData);
      if (!review) {
        Logger.error('Review failed to post');
        return res.status(400).json('Review failed to post');
      }
      Logger.info('Review added');
      return res.status(200).json(review);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async editUserReview(req, res, next) {
    try {
      const userId = req.user._id.toString();
      const reviewData = await DB.Review.findById(req.params.reviewId);
      // const incomingData = req.body;
      if (!reviewData.userId === userId) {
        Logger.error('User not authorised');
        return res.status(403).json('Not authorised');
      }
      // for (const props in incomingData) {
      //   reviewData[props] = incomingData[props];
      // }
      const update = await DB.Review.findByIdAndUpdate(
        req.params.reviewId,
        reviewData,
        { new: true },
      );
      if (!update) {
        Logger.error('Review not updated');
        return res.status(400).json('Review not updated');
      }
      Logger.info('Review Edited');
      return res.status(200).json(update);
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },

  async deleteReview(req, res, next) {
    try {
      const userId = req.user._id.toString();
      const review = await DB.Review.findById(req.params.reviewId);
      if (review.userId === userId) {
        const removed = await DB.Review.findByIdAndRemove(req.params.reviewId);
        if (!removed) {
          return Logger.error('Review not found');
        }
        Logger.info('Review Removed');
        return res.status(200).json('Review removed');
      }
      return next();
    } catch (err) {
      Logger.error(err);
      return next(err);
    }
  },
};

export default ReviewController;
