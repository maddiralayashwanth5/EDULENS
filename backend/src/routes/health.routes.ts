import { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { getRedisClient } from '../config/redis';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const checks = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      status: 'ok',
      services: {
        database: 'unknown',
        redis: 'unknown',
      },
    };

    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.services.database = 'healthy';
    } catch (error) {
      checks.services.database = 'unhealthy';
      checks.status = 'error';
    }

    // Check Redis connection
    try {
      const redis = getRedisClient();
      if (redis) {
        await redis.ping();
        checks.services.redis = 'healthy';
      } else {
        checks.services.redis = 'not configured';
      }
    } catch (error) {
      checks.services.redis = 'unhealthy';
    }

    const statusCode = checks.status === 'ok' ? 200 : 503;
    res.status(statusCode).json(checks);
  } catch (error) {
    res.status(503).json({
      timestamp: new Date().toISOString(),
      status: 'error',
      message: 'Health check failed',
    });
  }
});

export default router;
