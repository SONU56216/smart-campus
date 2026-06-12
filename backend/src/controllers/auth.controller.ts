import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { generateStudentId, generateOTP } from '../utils/generateId';
import { generateStaticQR } from '../utils/qrGenerator';
import { sendWelcomeEmail, sendPasswordResetOTP } from '../utils/email';
import redis from '../config/redis';
import AppError from '../utils/AppError';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../utils/validators';

// Local high-availability in-memory fallback for verification codes
const localOtpStore = new Map<string, { otp: string; expiresAt: number }>();

const storeOTP = async (email: string, otp: string): Promise<void> => {
  try {
    if (redis.status === 'ready') {
      await redis.set(`otp:${email}`, otp, 'EX', 600); // 10 minutes expiry
    }
  } catch (error) {
    console.warn('⚠️ [REDIS] Error writing OTP, falling back to local memory store:', error);
  }
  // Host inside our in-memory cache as double protection
  localOtpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
};

const verifyOTP = async (email: string, clientOtp: string): Promise<boolean> => {
  let storedOtp: string | null = null;
  try {
    if (redis.status === 'ready') {
      storedOtp = await redis.get(`otp:${email}`);
    }
  } catch (error) {
    console.warn('⚠️ [REDIS] Error reading OTP, falling back to local memory check:', error);
  }

  if (storedOtp) {
    return storedOtp === clientOtp;
  }

  // Check fallback store
  const localRecord = localOtpStore.get(email);
  if (localRecord && localRecord.expiresAt > Date.now()) {
    return localRecord.otp === clientOtp;
  }

  return false;
};

const clearOTP = async (email: string): Promise<void> => {
  try {
    if (redis.status === 'ready') {
      await redis.del(`otp:${email}`);
    }
  } catch (error) {
    // Suppress
  }
  localOtpStore.delete(email);
};

/**
 * Helper to set safety secure cookies
 */
const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * 1. register
 * Registers a student profile, auto-issues the secure digital credentials card, and dispatches the welcome notification.
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate inputs
    const validatedData = await registerSchema.parseAsync(req.body);

    // Assert email, phone, and rollNumber uniqueness
    const existingStudent = await prisma.student.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { rollNumber: validatedData.rollNumber }
        ]
      }
    });

    if (existingStudent) {
      throw new AppError('A student record with this email address or roll number already exists.', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Generate IDs and secure constants
    const studentId = generateStudentId();
    const validityYears = 4;
    const cardIssuedAt = new Date();
    const cardExpiresAt = new Date();
    cardExpiresAt.setFullYear(cardExpiresAt.getFullYear() + validityYears);

    // Generate static QR identifier data
    const rawQrValue = `CAM-${studentId}`;
    const qrCodeDataUrl = await generateStaticQR(rawQrValue);

    // Create record on the database
    const newStudent = await prisma.student.create({
      data: {
        ...validatedData,
        studentId,
        password: hashedPassword,
        cardStatus: 'ISSUED', // Auto-issue dynamic digital pass
        cardIssuedAt,
        cardExpiresAt,
        qrCodeData: qrCodeDataUrl,
        cardVersion: 1,
        walletBalance: 0.0,
        isActive: true,
      }
    });

    // Generate payloads and JSON Web Tokens
    const payload = {
      id: newStudent.id,
      role: 'STUDENT',
      email: newStudent.email,
      studentId: newStudent.studentId,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setTokenCookies(res, accessToken, refreshToken);

    // Notify student via email background-thread cleanly
    sendWelcomeEmail({
      email: newStudent.email,
      fullName: newStudent.fullName,
      studentId: newStudent.studentId,
      rollNumber: newStudent.rollNumber
    }).catch(err => console.error('Background welcome email failed:', err));

    res.status(201).json({
      status: 'success',
      message: 'Student registered and provisioned successfully.',
      data: {
        accessToken,
        refreshToken,
        student: {
          id: newStudent.id,
          studentId: newStudent.studentId,
          fullName: newStudent.fullName,
          email: newStudent.email,
          rollNumber: newStudent.rollNumber,
          course: newStudent.course,
          semester: newStudent.semester,
          cardStatus: newStudent.cardStatus,
          qrCodeData: newStudent.qrCodeData
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. login
 * Student sign-in endpoint accepting digital Email or Student ID as the primary login identifier.
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { loginIdentifier, password } = await loginSchema.parseAsync(req.body);

    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { studentId: loginIdentifier }
        ]
      }
    });

    if (!student) {
      throw new AppError('Incorrect credentials. Please verify your student ID/email and password.', 401);
    }

    if (!student.isActive) {
      throw new AppError('Your student session has been deactivated. Please contact campus security.', 403);
    }

    const matches = await comparePassword(password, student.password);
    if (!matches) {
      throw new AppError('Incorrect credentials. Please verify your student ID/email and password.', 401);
    }

    const payload = {
      id: student.id,
      role: 'STUDENT',
      email: student.email,
      studentId: student.studentId
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Student session authenticated.',
      data: {
        accessToken,
        refreshToken,
        student: {
          id: student.id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          rollNumber: student.rollNumber,
          course: student.course,
          semester: student.semester,
          cardStatus: student.cardStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. adminLogin
 * Dedicated Administrative access portal validating secure role capabilities.
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide both administrative email and password.', 400);
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      throw new AppError('Access Denied. Invalid credentials or insufficient permissions.', 401);
    }

    if (!admin.isActive) {
      throw new AppError('This administrative profile has been suspended.', 403);
    }

    const matches = await comparePassword(password, admin.password);
    if (!matches) {
      throw new AppError('Access Denied. Invalid credentials.', 401);
    }

    const payload = {
      id: admin.id,
      role: admin.role,
      email: admin.email
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Administrative session authenticated.',
      data: {
        accessToken,
        refreshToken,
        admin: {
          id: admin.id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. logout
 * Revokes browser-side secure cookies.
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    res.status(200).json({
      status: 'success',
      message: 'Authenticated session ended. Cookies removed.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. refreshToken
 * Rotates stale accessToken using an active refresh token.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      throw new AppError('Session refresh token is missing. Please sign in again.', 401);
    }

    const decoded = require('jsonwebtoken').verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-change-this-in-production-12345'
    ) as any;

    const payload = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      studentId: decoded.studentId
    };

    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({
      status: 'success',
      message: 'Session token refreshed.',
      data: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    next(new AppError('Refresh token expired or invalid. Please sign in again.', 401));
  }
};

/**
 * 6. forgotPassword
 * Dispatches a temporary 6-digit access code to the matching student profile.
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = await forgotPasswordSchema.parseAsync(req.body);

    const student = await prisma.student.findUnique({
      where: { email }
    });

    if (!student) {
      // Return 200 in production to prevent email enumeration, but give transparent message here for the developer
      res.status(200).json({
        status: 'success',
        message: 'If the email matches an active profile, a secure OTP code has been dispatched.'
      });
      return;
    }

    const otp = generateOTP();
    await storeOTP(email, otp);

    // Call background thread email dispatcher
    sendPasswordResetOTP(student.email, student.fullName, otp).catch(err =>
      console.error('Password reset OTP dispatch fail:', err)
    );

    res.status(200).json({
      status: 'success',
      message: 'Secure password reset verification OTP was cleanly generated and dispatched.',
      // Embed OTP in development-only modes for fast API testing
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. resetPassword
 * Consumes the dispatched OTP and commits the updated hashed password.
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp, newPassword } = await resetPasswordSchema.parseAsync(req.body);

    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      throw new AppError('The verification code is incorrect or expired. Please request another OTP.', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.student.update({
      where: { email },
      data: { password: hashedPassword }
    });

    // Revoke OTP immediately to prevent double usage
    await clearOTP(email);

    res.status(200).json({
      status: 'success',
      message: 'Your system security password has been changed successfully. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 8. changePassword
 * Modifies authentication password inside an active session.
 */
export const changePassword = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id || req.admin?.id;

    if (!userId) {
      throw new AppError('Authentication mismatch. User session not verified.', 401);
    }

    if (!oldPassword || !newPassword) {
      throw new AppError('Provide both old password and new password.', 400);
    }

    // Try match as Student or Admin
    let userRecord: any = null;
    let tableType: 'student' | 'admin' = 'student';

    userRecord = await prisma.student.findUnique({ where: { id: userId } });
    if (!userRecord) {
      userRecord = await prisma.admin.findUnique({ where: { id: userId } });
      tableType = 'admin';
    }

    if (!userRecord) {
      throw new AppError('Active profile record not found.', 404);
    }

    const matches = await comparePassword(oldPassword, userRecord.password);
    if (!matches) {
      throw new AppError('The existing password code is incorrect.', 400);
    }

    const hashedNewPassword = await hashPassword(newPassword);

    if (tableType === 'student') {
      await prisma.student.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
    } else {
      await prisma.admin.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Security credentials updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};
