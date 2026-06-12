import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';

// Extend Express Request object
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    studentId?: string;
    fullName: string;
    permissions?: string[];
  };
}

/**
 * Express middleware to guard routes ensuring the request comes from an authenticated user
 */
export const protect = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Recover token from cookies or Auth Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new AppError('Access denied. Please authenticate with a valid bearer token.', 401);
  }

  // 2. Decode & verify token signature
  const decoded: TokenPayload = verifyToken(token);

  // 3. Retrieve user profile from DB to verify if user is still active in system
  let userDetails: any;

  if (decoded.role === 'STUDENT') {
    userDetails = await prisma.student.findUnique({
      where: { id: decoded.id },
    });
    
    if (!userDetails || !userDetails.isActive) {
      throw new AppError('The student account belonging to this security token is inactive or deleted.', 401);
    }
  } else {
    // Admin, Academic, Financial, Admin roles
    userDetails = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!userDetails || !userDetails.isActive) {
      throw new AppError('The administrator profile belonging to this security token is disabled.', 401);
    }
  }

  // 4. Attach verified profile to request
  req.user = {
    id: userDetails.id,
    email: userDetails.email,
    role: decoded.role,
    studentId: userDetails.studentId, // will be undefined for Admins
    fullName: userDetails.fullName,
    permissions: userDetails.permissions || [], // Admin specific custom keys
  };

  next();
});

/**
 * Authorize route logic targeting specific roles
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access attempt detected.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Your security clearance level (${req.user.role}) is insufficient to access this action.`, 403)
      );
    }

    next();
  };
};

/**
 * Highly granular admin permission check middleware
 */
export const checkPermissions = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access attempt.', 401));
    }

    // Super user bypasses all sub-permission validations
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const permissions = req.user.permissions || [];
    
    if (!permissions.includes('ALL_ACCESS') && !permissions.includes(requiredPermission)) {
      return next(
        new AppError(`You do not possess the required digital authorization: '${requiredPermission}'.`, 403)
      );
    }

    next();
  };
};
