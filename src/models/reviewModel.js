const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// import m2s from 'mongoose-to-swagger';

const reviewSchema = new mongoose.Schema({
  UserId: {
    type: Schema.Types.ObjectId,
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
    default: 0,
    min: 0,
    max: 5,
  },
  GoodService: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
  WifiRate: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
  },
  QuitePlace: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 5,
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
