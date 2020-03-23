import mongoose from 'mongoose';
import { mongoUrl } from '../config';
import logger from './logger';

// Mongo connection
export default async () => {
  try {
    const connection = await mongoose.connect(mongoUrl.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    return connection.connection.db;
  } catch (error) {
    return logger.error(error);
  }
};
