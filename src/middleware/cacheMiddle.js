import { JsonOut } from '../helpers';
import Client from '../loaders/redis';
import logger from '../loaders/logger';

// Cache middleware
const cache = async (req, res, next) => {
  try {
    const userID = req.params.userId;
    // logger.info('Getting a user request', userID);
    // Redis GET to take the cached data all users or one user
    await Client.get(!userID ? 'users' : 'user', (error, cachedData) => {
      // Any error stop here and log
      if (error) return logger.error('Redis error', error);
      logger.info('Redis data', JsonOut(cachedData)); // => to see the data from cache
      // Any cache data we get from Redis
      if (!cachedData) {
        // No data from Redis so we pass to the endpoint hit directly
        logger.info('Not cached data GET from endpoint directly');
        return next();
      }
      // Data from Redis so return the cachedData
      logger.info('Data from Redis cache');
      return res.status(200).send(JSON.parse(cachedData));
    });
    return Client;
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

export default cache;
