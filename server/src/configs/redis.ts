import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

import logger from './winston';

const REDIS_URL: string | undefined = process.env.REDIS_URL;

if (!REDIS_URL) {
  logger.error('Redis connection url missing!');
}

export const client: RedisClientType = createClient({
  url: REDIS_URL
});

client.on('error', (err: unknown) => logger.error('Redis Client Error', err));

export const connectToRedis = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info('redis connected');
  } catch (error) {
    logger.info('redis connection failed', error);
  }
};
