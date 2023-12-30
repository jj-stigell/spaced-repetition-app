import { createClient, RedisClientType } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();

import logger from './winston';

/**
 * Redis Configuration:
 * - REDIS_URL: The full URL for the Redis server, if available.
 * - REDIS_HOST and REDIS_PORT: Specific host and port for the Redis server,
 *   with default values of 'localhost' and 6379, respectively.
 */
const REDIS_URL: string | undefined = process.env.REDIS_URL;
const REDIS_HOST: string = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT: number = isNaN(Number(process.env.REDIS_PORT)) ?
  6379 : Number(process.env.REDIS_PORT);

/**
 * Redis Client Initialization:
 * Creates a Redis client instance using either the provided `REDIS_URL` or
 * the `REDIS_HOST` and `REDIS_PORT`. This allows for flexible configuration
 * depending on the environment.
 */
export const redisClient: RedisClientType = REDIS_URL ?
  createClient({ url: REDIS_URL }) :
  createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT
    }
  });

/**
 * Redis Error Handling:
 * Sets up an error listener on the Redis client to log any connection errors,
 * aiding in debugging and monitoring.
 */
redisClient.on('error', (err: unknown) => {
  console.error('Redis Client Error', err);
});

/**
 * Function to Connect to Redis:
 * Asynchronously connects to the Redis server and logs the connection status.
 * This function is exported for use wherever a Redis connection is needed.
 */
export const connectToRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('redis connected');
  } catch (error) {
    logger.info('redis connection failed', error);
  }
};

/**
 * Graceful Shutdown Handling:
 * Ensures that the Redis client is properly closed when the Node.js process exits.
 * This is important for cleanly releasing resources and avoiding potential memory leaks.
 */
process.on('exit', function () {
  redisClient.quit();
});
