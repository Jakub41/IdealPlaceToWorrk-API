import expressLoader from './express';
import mongooseLoader from './mongoose';
import Logger from './logger';

// Initialize express
export default async ({ expressApp }) => {
  try {
    // Loading Mongo
    await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');

    // Loading express
    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
  } catch (error) {
    Logger.error(error);
  }
};
