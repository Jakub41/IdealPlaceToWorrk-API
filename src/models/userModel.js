import mongoose from 'mongoose';

const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a full name'],
    index: true,
  },
});

export default mongoose.model('User', User);
