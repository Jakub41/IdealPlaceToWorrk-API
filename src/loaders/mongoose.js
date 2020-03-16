import mongoose from 'mongoose';
import { mongoUrl } from '../config';
import logger from './logger';

export default async () => {
  try {
    const connection = await mongoose.connect(mongoUrl.url);
    return connection.connection.db;
  } catch (error) {
    return logger.error(error);
  }
};
