import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { getRedisClient } from '../config/redis';

// Create rate limiters for different endpoints (lazy initialization)
let rateLimiters: any = null;

const getRateLimiters = () => {
  if (!rateLimiters) {
    try {
      const redisClient = getRedisClient();
      
      const createRateLimiter = (points: number, duration: number, keyPrefix: string) => {
        return new RateLimiterRedis({
          storeClient: redisClient,
          keyPrefix,
          points, // Number of requests
          duration, // Per duration in seconds
        });
      };

      rateLimiters = {
        general: createRateLimiter(100, 60, 'rl_general'), // 100 requests per minute
        auth: createRateLimiter(5, 300, 'rl_auth'), // 5 requests per 5 minutes
        search: createRateLimiter(50, 60, 'rl_search'), // 50 requests per minute
        upload: createRateLimiter(10, 300, 'rl_upload'), // 10 uploads per 5 minutes
      };
    } catch (error) {
      // Redis not available, return null
      return null;
    }
  }
  return rateLimiters;
};

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limiters = getRateLimiters();
    
    // If Redis is not available, skip rate limiting
    if (!limiters) {
      return next();
    }
    
    const key = req.ip || 'unknown';
    
    // Choose rate limiter based on route
    let limiter = limiters.general;
    
    if (req.path.startsWith('/api/auth')) {
      limiter = limiters.auth;
    } else if (req.path.includes('/search')) {
      limiter = limiters.search;
    } else if (req.path.includes('/upload')) {
      limiter = limiters.upload;
    }

    await limiter.consume(key);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes.remainingPoints || 0;
    const msBeforeNext = rejRes.msBeforeNext || 1000;
    
    res.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    res.set('X-RateLimit-Limit', String(rejRes.totalHits || 100));
    res.set('X-RateLimit-Remaining', String(remainingPoints));
    res.set('X-RateLimit-Reset', String(new Date(Date.now() + msBeforeNext)));
    
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  }
};
