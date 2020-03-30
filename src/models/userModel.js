import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import validator from 'validator';
import { Capitalize } from '../helpers';
// import m2s from 'mongoose-to-swagger';
// => Use this to output in console the model structure check the bottom of thr file

const userSchema = new mongoose.Schema({
  // for now username will be equal to email (if user registered by email) later on i suppose we
  // can change it to be just email and not to be required since data from google and facebook will
  // be stored as firstname and lastname and we can use it do display reviews (just sugestion)

  username: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate: {
      validator: (string) => validator.isEmail(string),
      message: 'Provided email is invalid',
    },
  },
  picture: {
    type: String,
    required: false,
    default:
      'https://images.unsplash.com/photo-1527443195645-1133f7f28990?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  },
  firstname: {
    type: String,
    set: Capitalize,
    required: true,
  },
  lastname: {
    type: String,
    set: Capitalize,
    required: true,
  },
  favouritePlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'place',
    },
  ],
  facebookId: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  addedPlaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'place',
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

const UserModel = mongoose.model('user', userSchema);

// Swagger docs
// Use this part to see the structure of the models
// The output can be copy/paste inside the "swagger.json"
// To document the model under model definition section
// This can be commented to production
// const swaggerSchema = m2s(UserModel);
// eslint-disable-next-line no-console
// console.log(swaggerSchema);

export default UserModel;
