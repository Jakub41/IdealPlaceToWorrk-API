/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-const-assign */
import redis from 'redis';
import { redisConfig } from '../config';
import Logger from './logger';

// Redis default port === 6379
const REDIS_PORT = redisConfig.port || 6379;
const { REDIS_URL } = process.env;

let cache = '';
// Prod
if (process.env.NODE_ENV !== 'development') {
  cache = redis.createClient(REDIS_URL);
  Logger.info('production');
} else {
  // Connect to redis Dev
  cache = redis.createClient(REDIS_PORT);
  Logger.info('development');
}

// Check connection
cache.on('connect', () => {
  Logger.info('Connected to Redis');
});

cache.on('error', () => {
  Logger.error('Redis not connected');
});

export default cache;
