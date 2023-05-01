import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

import logger from './winston';
import { NODE_ENV } from './environment';

const REDIS_URL: string | undefined = process.env.REDIS_URL;

if (!REDIS_URL && NODE_ENV === 'production') {
  logger.error('Redis connection url missing, required in production!');
  process.exit();
}

export const redisClient: RedisClientType =
  NODE_ENV === 'production'
    ? createClient({
      url: REDIS_URL,
    })
    : createClient();

redisClient.on('error', (err: unknown) => logger.error('Redis Client Error', err));

export const connectToRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('redis connected');
  } catch (error) {
    logger.info('redis connection failed', error);
    // https://www.knowledgehut.com/blog/web-development/node-js-process-exit
    // process.exit();
  }
};

/*
process.on("exit", function(){
    redisClient.quit();
});
*/
