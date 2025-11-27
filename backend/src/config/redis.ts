import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

let redisClient: RedisClientType | null = null;
let redisConnected = false;

export async function connectRedis(): Promise<RedisClientType | null> {
  // Skip Redis in development if not available
  if (process.env.SKIP_REDIS === 'true') {
    logger.info('Skipping Redis connection (SKIP_REDIS=true)');
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 5000, // 5 second timeout
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            logger.warn('Redis connection failed after 3 retries, continuing without Redis');
            return false; // Stop retrying
          }
          return Math.min(retries * 100, 1000);
        },
      },
    });

    redisClient.on('error', (err) => {
      if (redisConnected) {
        logger.error('Redis Client Error:', err);
      }
    });

    redisClient.on('connect', () => {
      redisConnected = true;
      logger.info('Connected to Redis');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('end', () => {
      redisConnected = false;
      logger.info('Redis connection closed');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn('Redis not available, continuing without Redis');
    redisClient = null;
    return null;
  }
}

export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

export function isRedisConnected(): boolean {
  return redisConnected && redisClient !== null;
}

export async function disconnectRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      // Ignore errors during disconnect
    }
    redisClient = null;
    redisConnected = false;
  }
}
