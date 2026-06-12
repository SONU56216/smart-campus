import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import winston from 'winston';

import AppError from './utils/AppError';
import errorHandler from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

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

// 1. Set Security HTTP headers
app.use(helmet());

// 2. Enable Cross-Origin Resource Sharing (CORS) with options
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// 3. Logger Middleware (Morgan)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Rate Limiting Middleware for `/api` endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'fail',
    message: 'Too many requests from this IP address, please try again after 15 minutes.'
  }
});
app.use('/api', apiLimiter);

// 5. Body Parsing Middlewares
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 6. Basic Health Assessment Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    message: 'Smart Campus Digital Ecosystem Backend Core running smoothly.',
    environment: process.env.NODE_ENV || 'production',
  });
});

// 7. Base API Route Placeholder / Swagger Spec / Information
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    version: '1.0.0',
    title: 'Smart Campus API Interface',
    documentation: '/api/v1/docs-placeholder',
  });
});

// --- DYNAMIC MODULE ROUTES ---
// Mount our complete V1 api routing layer (Auth, and future services)
app.use('/api/v1', apiRoutes);

// 8. 404 Route handler for unregistered paths
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this campus server!`, 404));
});

// 9. Mounting Global Error Handler
app.use(errorHandler);

export default app;
