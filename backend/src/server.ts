import dotenv from 'dotenv';
import path from 'path';

// 1. Load context environment variables before any imports
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import prisma from './config/database';
import redis from './config/redis';
import winston from 'winston';

const PORT = process.env.PORT || 5000;

// Set up logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Guard against unhandled synchronous exceptions (e.g., syntax errors, reference anomalies)
process.on('uncaughtException', (err: Error) => {
  logger.error('CRITICAL UNCAUGHT EXCEPTION! Shutting down server immediately...', err);
  process.exit(1);
});

let server: any;

const connectServices = async () => {
  try {
    // A. Connect to PostgreSQL via Prisma Client Engine
    logger.info('⏳ Verifying PostgreSQL database bridge via Prisma client...');
    await prisma.$connect();
    logger.info('📊 PostgreSQL connection ready.');

    // B. Verify Redis connection ping
    logger.info('⏳ Greeting cache tier...');
    const pingResponse = await redis.ping();
    logger.info(`⚡ Redis responds: ${pingResponse}`);

    // C. Initialize HTTP Express instance
    server = app.listen(PORT, () => {
      logger.info(`✨ Smart Campus server successfully operational on port ${PORT} in [${process.env.NODE_ENV || 'production'}] mode`);
    });

  } catch (error: any) {
    logger.error('💥 Failed to start Smart Campus services:', error);
    process.exit(1);
  }
};

connectServices();

// Handle asynchronous promise rejections (e.g., dropped TCP, network queries failure)
process.on('unhandledRejection', (err: any) => {
  logger.error('💥 UNHANDLED PROMISE REJECTION! Commencing elegant shutdown...', err);
  if (server) {
    server.close(() => {
      logger.info('🚪 Web server stopped.');
      shutdownServices();
    });
  } else {
    shutdownServices();
  }
});

// Shutdown helper to disconnect database client & Redis client cleanly
const shutdownServices = async () => {
  try {
    logger.info('🔌 Disconnecting from PostgreSQL...');
    await prisma.$disconnect();
    logger.info('🔻 PostgreSQL connection terminated.');

    logger.info('🔌 Disconnecting from Redis cluster...');
    await redis.disconnect();
    logger.info('🔻 Redis client safely ejected.');

    logger.info('👋 Graceful shutdown finalized. System offline.');
    process.exit(0);
  } catch (err: any) {
    logger.error('❌ Error during services offline procedure:', err);
    process.exit(1);
  }
};

// Graceful signal handlers for containerization lifecycles (e.g. Kubernetes, Docker Swarm, PM2)
process.on('SIGTERM', () => {
  logger.warn('📥 SIGTERM signal received. Initiating graceful server termination.');
  if (server) {
    server.close(() => {
      logger.info('🛑 Express server offline.');
      shutdownServices();
    });
  } else {
    shutdownServices();
  }
});

process.on('SIGINT', () => {
  logger.warn('📥 SIGINT (Ctrl+C) signal received. Terminating system.');
  if (server) {
    server.close(() => {
      logger.info('🛑 Express server offline.');
      shutdownServices();
    });
  } else {
    shutdownServices();
  }
});
