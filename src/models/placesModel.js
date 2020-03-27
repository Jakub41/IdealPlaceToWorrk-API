import mongoose from 'mongoose';
// import m2s from 'mongoose-to-swagger';

const placeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    reference: 'user',
    required: false,
  },
  Location: {
    type: String,
    required: true,
  },
  Types: [
    {
      type: String,
      required: true,
    },
  ],
  Website: {
    type: String,
    required: false,
  },
  Description: {
    type: String,
    required: false,
  },
  OpenHours: {
    type: Array,
    required: true,
  },
  Pictures: [
    {
      type: String,
      required: true,
      default:
        'https://images.unsplash.com/photo-1492158244976-29b84ba93025?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80',
    },
  ],
  OpenNight: {
    type: Boolean,
    required: false,
  },

  // We can calculate average by culculating them in Reviews insted of having another
  // field in Schema itself

  Reviews: [
    {
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
    },
  ],
  PriceToEnter: {
    type: Number,
    required: true,
  },
  Wifi: {
    type: Boolean,
    required: false,
  },
  RateAverage: {
    type: Number,
    required: false,
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
  IsReferencedOnGoogle: {
    type: Boolean,
    required: true,
    default: false,
  },
  GoogleId: {
    type: String,
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

const PlaceModel = mongoose.model('place', placeSchema);

// const swaggerSchema = m2s(PlaceModel);
// console.log(swaggerSchema);

export default PlaceModel;
