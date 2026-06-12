import { Router } from 'express';
import {
  register,
  login,
  adminLogin,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../utils/validators';

const router = Router();

// 1. Student sign-up route
router.post('/register', authLimiter, validate(registerSchema), register);

// 2. Student standard credential sign-in route
router.post('/login', authLimiter, validate(loginSchema), login);

// 3. Administrative portal access login route
router.post('/admin-login', authLimiter, adminLogin);

// 4. Session revocation route
router.post('/logout', logout);

// 5. JWT token rotation route
router.post('/refresh-token', refreshToken);

// 6. Forgot Password (OTP email generation trigger)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);

// 7. Reset Password (OTP consumption & update commit)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

// 8. Session-level password modification route (Requires authenticated state)
router.post('/change-password', protect, changePassword);

export default router;
