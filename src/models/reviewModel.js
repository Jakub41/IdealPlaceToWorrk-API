import mongoose from 'mongoose';
// import m2s from 'mongoose-to-swagger';

const reviewSchema = new mongoose.Schema({
  Author: {
    type: String,
    required: true,
  },
  UserId: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  PlaceId: {
    type: mongoose.Types.ObjectId,
    reference: 'place',
  },
  Text: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
    min: [1, 'min is 1'],
    max: [5, 'max is 5'],
  },
  GoodService: {
    type: Number,
    required: true,
    min: [1, 'min is 1'],
    max: [5, 'max is 5'],
  },
  WifiRate: {
    type: Number,
    required: true,
    min: [1, 'min is 1'],
    max: [5, 'max is 5'],
  },
  QuitePlace: {
    type: Number,
    required: true,
    min: [1, 'min is 1'],
    max: [5, 'max is 5'],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date,
  },
});

const ReviewModel = mongoose.model('review', reviewSchema);

// const swaggerSchema = m2s(ReviewModel);
// console.log(swaggerSchema);

export default ReviewModel;
