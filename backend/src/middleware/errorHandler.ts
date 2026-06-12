import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import AppError from '../utils/AppError';

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Prisma Known Request Error code handler
const handlePrismaError = (err: any): AppError => {
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? ` (${(err.meta.target as string[]).join(', ')})` : '';
    return new AppError(`Duplicate field value entered. A record already exists with this database constraint${fields}.`, 409);
  }
  if (err.code === 'P2025') {
    return new AppError(err.meta?.cause || 'The requested database record was not found.', 404);
  }
  if (err.code === 'P2003') {
    return new AppError('Foreign key constraint failed. A related record was not found or is still attached.', 400);
  }
  return new AppError(`Database transaction failure: ${err.message}`, 400);
};

// Zod validation error handler
const handleZodError = (err: any): AppError => {
  const issues = err.issues || [];
  const errors = issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
  const errorMessage = `Validation fields invalid. ${errors.join(', ')}`;
  return new AppError(errorMessage, 400);
};

// JWT specific error handlers
const handleJWTError = (): AppError => new AppError('Invalid security signature. Please sign in again.', 401);
const handleJWTExpiredError = (): AppError => new AppError('Security access session has expired. Please log in again.', 401);

const sendErrorDev = (err: AppError & { stack?: string }, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send user-friendly message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details and send general response
    logger.error('CRITICAL INTERNAL ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong inside our campus system. Please try again later.',
    });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    let errorObj = { ...err, message: err.message, stack: err.stack };
    
    // Check specific frameworks error origins for better DX
    if (err.name === 'ZodError') errorObj = handleZodError(err);
    if (err.constructor?.name === 'PrismaClientKnownRequestError') errorObj = handlePrismaError(err);
    
    sendErrorDev(errorObj, res);
  } else {
    let errorObj = Object.create(err);
    errorObj.message = err.message;
    errorObj.statusCode = err.statusCode;
    errorObj.status = err.status;
    errorObj.isOperational = err.isOperational;

    // Prisma Engine
    if (err.code && err.code.startsWith('P')) {
      errorObj = handlePrismaError(err);
    }
    // Zod Validation
    if (err.name === 'ZodError' || err.issues) {
      errorObj = handleZodError(err);
    }
    // JsonWebToken authentication
    if (err.name === 'JsonWebTokenError') {
      errorObj = handleJWTError();
    }
    // Token Expired
    if (err.name === 'TokenExpiredError') {
      errorObj = handleJWTExpiredError();
    }

    sendErrorProd(errorObj, res);
  }
};

export default errorHandler;
