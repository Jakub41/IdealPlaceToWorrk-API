import expressLoader from './express';
import Logger from './logger';

// Initialize express
export default async ({ expressApp }) => {
  try {
    await expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');
  } catch (error) {
    Logger.error(error);
  }
};
