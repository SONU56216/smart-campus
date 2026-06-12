import rateLimit from 'express-rate-limit';

/**
 * Brute-force protection for login and registration actions
 * Max 5 attempts per 15-minute slot
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'fail',
    message: 'Too many login or registration attempts. Please try again after 15 minutes.',
  }
});

/**
 * General application API endpoint request rate controller
 * Max 100 requests per 15-minute slot
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests on this API client session. Please slow down and try again in 15 minutes.',
  }
});

/**
 * Admin portal bulk operations guard
 * Max 200 requests per 15-minute slot
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'High frequency admin actions detected. Control requests are capped at 200 every 15 minutes.',
  }
});

/**
 * File upload resource preservation guard
 * Max 10 resource uploads per hour
 */
export const fileUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Upload bandwidth limit hit. You can upload up to 10 document assets per hour.',
  }
});
