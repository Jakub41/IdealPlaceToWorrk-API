/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { JsonOut } from '../helpers';
import Redis from '../loaders/redis';
import logger from '../loaders/logger';

// Redis cache system
const Cache = {
  // On post methods
  async post_set_data(req, data, get_key) {
    const key = String(data._id);
    await Redis.setex(key, 3600, JSON.stringify(data), (err) => {
      if (err) {
        logger.error('Post Set Data failed!', err);
      } else {
        logger.info('Post Set Data Successfully!');
        this.delete_set(get_key);
      }
    });
  },
  // On update method
  async update_Specific_Data(req, data) {
    await Redis.setex(req.originalUrl, 3600, JSON.stringify(data), (err) => {
      if (err) {
        logger.error('Update Specific Data failed!', err);
      } else {
        logger.info('Update Specific Data Successfully!');
        this.delete_set(req.originalUrl);
      }
    });
  },
  // on get all data method
  async get_all_data(req, res, next) {
    logger.info('Original URL', req.originalUrl);
    logger.info(req);
    // Redis GET to take the cached data
    await Redis.get(req.originalUrl, (error, cachedData) => {
      // Any error stop here and log
      if (error) return logger.error('Redis error', error);
      // Any cache data we get from Redis
      if (cachedData != null) {
        logger.info('Redis data', JsonOut(cachedData)); // => to see the data from cache
        res.status(200).send(JSON.parse(cachedData));
      } else {
        // No data in cache then hit the DB directly
        logger.info('No data from Redis');
        return next();
      }
    });
  },
  // On methods where the data is set
  async set_all_data(req, data) {
    await Redis.setex(req.originalUrl, 3600, data, (err) => {
      if (err) {
        logger.error('Set All Data failed!');
      } else {
        logger.info('Set All Data Successfully!');
      }
    });
  },
  // On methods where to get a specific data
  async get_Specific_Data(req, res, next) {
    logger.info(req);
    // Redis GET to take the cached data
    await Redis.get(req.originalUrl, (error, cachedData) => {
      // Any error stop here and log
      if (error) return logger.error('Redis error', error);
      // Any cache data we get from Redis
      if (cachedData != null) {
        logger.info('Redis data', JsonOut(cachedData)); // => to see the data from cache
        res.status(200).send(JSON.parse(cachedData));
      } else {
        // No data in cache then hit the DB directly
        logger.info('No data from Redis');
        return next();
      }
    });
  },
  // Set a specific method
  async set_Specific_Data(req, data) {
    await Redis.setex(req.originalUrl, 3600, data, (err) => {
      if (err) {
        logger.error('Set Specific Data failed!');
      } else {
        logger.info('Set Specific Data Successfully!');
      }
    });
  },
  // on delete method
  async set_Delete_data(req, data) {
    await Redis.setex(req.originalUrl, 3600, data, (err) => {
      if (err) {
        logger.error('Set Delete Data failed!');
      } else {
        logger.info('Set Delete Data Successfully!');
        this.delete_set(req.originalUrl);
      }
    });
  },

  async get_Delete_Data(req, res, next) {
    logger.info(req);
    // Redis GET to take the cached data
    await Redis.get(req.originalUrl, (error, cachedData) => {
      // Any error stop here and log
      if (error) return logger.error('Redis error', error);
      // Any cache data we get from Redis
      if (cachedData != null) {
        logger.info('Delete from Redis cache');
        res.status(200).send(JSON.parse(cachedData));
      } else {
        // No data in cache then hit the DB directly
        logger.info('No data from Redis');
        return next();
      }
    });
    return Redis;
  },

  async delete_set(key) {
    await Redis.del(key, (err, response) => {
      if (response === 1) {
        logger.info('Deleted Successfully!');
      } else {
        logger.error('Cannot delete!');
      }
    });
  },
};

// An index to above props
const redisIndex = {
  post_set: (req, data, get_key) => {
    Cache.post_set_data(req, data, get_key);
  },

  get_All: (req, res, next) => {
    Cache.get_all_data(req, res, next);
  },

  set_All: (req, res, next) => {
    Cache.set_all_data(req, res, next);
  },

  get_Specific_Data: (req, res, next) => {
    Cache.get_Specific_Data(req, res, next);
  },

  set_Specific_Data: (req, res, next) => {
    Cache.set_Specific_Data(req, res, next);
  },

  update_Specific_Data: (req, res, next) => {
    Cache.update_Specific_Data(req, res, next);
  },

  set_Delete_data: (req, res, next) => {
    Cache.set_Delete_data(req, res, next);
  },

  get_Delete_Data: (req, res, next) => {
    Cache.get_Delete_Data(req, res, next);
  },
};

export default redisIndex;
