import redis from 'redis';
import { redisConfig } from '../config';
import Logger from './logger';

// Redis default port === 6379
const REDIS_PORT = redisConfig.port || 6379;

// Connect to redis
const cache = redis.createClient(REDIS_PORT);

// Check connection
cache.on('connect', () => {
  Logger.info('Connected to Redis');
});

cache.on('error', () => {
  Logger.error('Redis not connected');
});

export default cache;
