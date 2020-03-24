import redis from 'redis';
import { redisConfig } from '../config';
import Logger from './logger';

// Redis default port === 6379
const REDIS_PORT = redisConfig.port || 6379;

// Connect to redis
const client = redis.createClient(REDIS_PORT);

// Check connection
client.on('connect', () => {
  Logger.info('Connected to Redis');
});

export default client;
