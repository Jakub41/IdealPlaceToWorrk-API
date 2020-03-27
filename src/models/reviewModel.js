import mongoose from 'mongoose';
// import m2s from 'mongoose-to-swagger';

const reviewSchema = new mongoose.Schema({
  Author: {
    type: String,
    required: true,
  },
  UserId: {
    type: mongoose.Types.ObjectId,
    reference: 'user',
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
  },
  GoodService: {
    type: Number,
    required: false,
  },
  WifiRate: {
    type: Number,
    required: false,
  },
  QuitePlace: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const ReviewModel = mongoose.model('review', reviewSchema);

// const swaggerSchema = m2s(ReviewModel);
// console.log(swaggerSchema);

export default ReviewModel;
