import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  OpenHoursWeekday: {
    type: String,
    required: true,
  },
  OpenHoursWeekend: {
    type: String,
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
    required: true,
  },
  Rates: [
    {
      type: Number,
      required: false,
      userId: {
        type: mongoose.Types.ObjectId,
        reference: 'user',
      },
    },
  ],
  PriceToEnter: {
    type: Number,
    required: true,
  },
  Wifi: {
    type: Boolean,
    required: true,
  },
  Rate: {
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
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('place', placeSchema);
