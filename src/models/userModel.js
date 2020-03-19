import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
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

// userSchema.methods.validPassword = (pwd) => {
//   // eslint-disable-next-line no-unused-expressions
//   this.password === pwd;
// };

// module.exports = mongoose.model('User', userSchema);
export default mongoose.model('User', userSchema);
