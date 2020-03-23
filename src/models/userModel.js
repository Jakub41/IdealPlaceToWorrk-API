import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import m2s from 'mongoose-to-swagger';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
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

const UserModel = mongoose.model('User', userSchema);

// Swagger docs
// Use this part to see the structure of the models
const swaggerSchema = m2s(UserModel);
console.log(swaggerSchema);

export default UserModel;
