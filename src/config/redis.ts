import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Client Connected'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error('Could not connect to Redis', err);
  }
};

export default redisClient;
