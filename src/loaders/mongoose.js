import mongoose from 'mongoose';
import { mongoUrl } from '../config';

export default async () => {
  const connection = await mongoose.connect(mongoUrl.url);
  return connection.connection.db;
};
