import Redis from 'ioredis';
import winston from 'winston';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Configure Redis with auto-reconnect strategy
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    logger.warn(`Redis connection retry attempt ${times} in ${delay}ms`);
    return delay;
  },
  reconnectOnError(err) {
    logger.error('Redis auto-reconnect on error trigger:', err);
    return true; // Reconnect on all errors
  }
});

// Event Listeners
redis.on('connect', () => {
  logger.info('🔌 Redis connection established successfully.');
});

redis.on('ready', () => {
  logger.info('🚀 Redis client ready for reading and writing commands.');
});

redis.on('error', (err) => {
  logger.error('❌ Redis Connection Error:', err);
});

redis.on('close', () => {
  logger.warn('⚠️ Redis connection closed.');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis client attempting to reconnect...');
});

export default redis;
