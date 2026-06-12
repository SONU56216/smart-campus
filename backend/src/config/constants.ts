// 1. Fee Defaults
export const FEE_DEFAULTS = {
  APPLICATION: 500.0,
  ADMISSION: 10000.0,
  SEMESTER: 50000.0,
  EXAM: 500.0,
  BACKLOG: 800.0,
  LATE: 200.0,
  HOSTEL: 40000.0,
  MESS: 20000.0,
  BUS: 15000.0,
};

// 2. JWT Config Defaults
export const JWT_CONFIG = {
  ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'super-secret-access-token-key-change-this-in-production-12345',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-change-this-in-production-12345',
  ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
};

// 3. File upload limits
export const FILE_LIMITS = {
  MAX_PHOTO_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_SIGNATURE_SIZE: 1 * 1024 * 1024, // 1MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// 4. Pagination Defaults
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// 5. Expiries & Validity Timers
export const EX_TIMER = {
  CARD_VALIDITY_YEARS: 4,
  QR_EXPIRY_SECONDS: 30, // Dynamic ID QR rotative expiry
  OTP_EXPIRY_MINUTES: 10,
};

// 6. Enums and Constants mirroring schemas safely
export const CARD_STATUS = {
  NOT_APPLIED: 'NOT_APPLIED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ISSUED: 'ISSUED',
  SUSPENDED: 'SUSPENDED',
  EXPIRED: 'EXPIRED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const APPLICATION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const EXAM_FORM_STATUS = {
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
} as const;

export const ADMIN_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ACADEMIC_ADMIN: 'ACADEMIC_ADMIN',
  FEES_ADMIN: 'FEES_ADMIN',
  ATTENDANCE_ADMIN: 'ATTENDANCE_ADMIN',
  CARD_ISSUER: 'CARD_ISSUER',
} as const;

export const ATTENDANCE_METHOD = {
  QR_SCAN: 'QR_SCAN',
  BIOMETRIC: 'BIOMETRIC',
  MANUAL: 'MANUAL',
  GEOFENCE: 'GEOFENCE',
} as const;
