import Client from '../loaders/redis';
import logger from '../loaders/logger';

// Cache middleware
const cache = (req, res, next) => {
  // Redis GET to take the cached data
  Client.get('users', (error, cachedData) => {
    // Any error stop here and log
    if (error) return logger.error('Redis error', error);
    // logger.info('Redis data', cachedData); => to see the data from cache
    // Any cache data we get from Redis
    if (!cachedData) {
      logger.info('Not cached data GET from endpoint directly');
      return next();
    }
    logger.info('Data from Redis cache');
    return res.status(200).send(JSON.parse(cachedData));
  });
};

export default cache;
