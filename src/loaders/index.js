import logSymbols from 'log-symbols';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import redisLoader from './redis';
import Logger from './logger';

// Initialize express
export default async ({ expressApp }) => {
  try {
    // Loading express
    await expressLoader({ app: expressApp });
    Logger.info('Express loaded');

    // Loading Mongo
    await mongooseLoader();
    Logger.info('DB loaded and connected!');

    // Loading Redis
    await redisLoader;
    Logger.info('Redis loaded');
  } catch (error) {
    Logger.error(`${logSymbols.error} ${error}`);
  }
};
