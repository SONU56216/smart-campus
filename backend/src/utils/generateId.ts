import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique, professional Student ID
 * Format: STU-YYYY-XXXXX (e.g., STU-2026-82741)
 */
export const generateStudentId = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `STU-${year}-${rand}`;
};

/**
 * Generates a unique, professional Admission Application ID / Number
 * Format: APP-YYYY-XXXXX (e.g., APP-2026-10738)
 */
export const generateApplicationId = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `APP-${year}-${rand}`;
};

/**
 * Generates a unique, professional Transaction ID
 * Format: TXN-YYYYMMDD-XXXXXXXX (e.g., TXN-20260611-F8A2B9CD)
 */
export const generateTransactionId = (): string => {
  const now = new Date();
  const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rands = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${yyyymmdd}-${rands}`;
};

/**
 * Generates a unique, professional Admit Card ID / Number
 * Format: ADC-YYYY-XXXXX (e.g., ADC-2026-59371)
 */
export const generateAdmitCardId = (): string => {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
  return `ADC-${year}-${rand}`;
};

/**
 * Generates a secure, 6-digit numerical OTP (One-Time Password)
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
