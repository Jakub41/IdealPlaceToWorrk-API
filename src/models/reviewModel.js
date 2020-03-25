/* eslint-disable linebreak-style */
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // userId: {type: mongoose.Schema.Types.ObjectId, ref: user}
  userId: String,
  // placeId: {type: mongoose.Schema.Types.ObjectId, ref: place}
  placeId: String,
  description: String,
  wifiRate: Number,
  serviceRate: Number,
});

const reviewCollection = mongoose.model('review', reviewSchema);

export default reviewCollection;
