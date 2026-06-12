import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/constants';
import AppError from './AppError';

export interface TokenPayload {
  id: string;
  role: string;
  email: string;
  studentId?: string;
}

/**
 * Generates an access token for a user session
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.ACCESS_SECRET, {
    expiresIn: JWT_CONFIG.ACCESS_EXPIRY,
  });
};

/**
 * Generates a refresh token for keeping user logged in
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.REFRESH_SECRET, {
    expiresIn: JWT_CONFIG.REFRESH_EXPIRY,
  });
};

/**
 * Verifies and decodes an access token
 */
export const verifyToken = (token: string, secret: string = JWT_CONFIG.ACCESS_SECRET): TokenPayload => {
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please login again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please login again.', 401);
    }
    throw new AppError('Authentication failed.', 401);
  }
};
