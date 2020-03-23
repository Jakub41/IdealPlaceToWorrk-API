import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  // for now username will be equal to email (if user registered by email) later on i suppose we
  // can change it to be just email and not to be required since data from google and facebook will
  // be stored as firstname and lastname and we can use it do display reviews (just sugestion)

  username: {
    type: String,
    required: true,
    unigue: true,
  },
  picture: {
    type: String,
    required: false,
    default:
      'https://images.unsplash.com/photo-1527443195645-1133f7f28990?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  favouritePlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'places',
    },
  ],
  addedPlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'places',
    },
  ],
  emailToken: {
    type: String,
    required: false,
  },
  active: {
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

userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);
