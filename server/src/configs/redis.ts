import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

import logger from './winston';

const REDIS_URL: string | undefined = process.env.REDIS_URL;
const REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT: number = isNaN(Number(process.env.REDIS_PORT)) ?
  6379 : Number(process.env.REDIS_PORT);

export const redisClient: RedisClientType = REDIS_URL ?
  createClient({
    url: REDIS_URL
  })
  : createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
    }
  });

redisClient.on('error', (err: unknown) => {
  console.error('Redis Client Error', err);
});

export const connectToRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('redis connected');
  } catch (error) {
    logger.info('redis connection failed', error);
  }
};

// https://www.knowledgehut.com/blog/web-development/node-js-process-exit
process.on('exit', function () {
  redisClient.quit();
});
