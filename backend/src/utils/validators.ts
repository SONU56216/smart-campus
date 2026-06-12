import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Provide a valid institutional email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  dob: z.string().transform(val => new Date(val)),
  gender: z.string().min(1, 'Gender is required'),
  category: z.string().min(1, 'Category is required'),
  bloodGroup: z.string().min(1, 'Blood Group is required'),
  guardianName: z.string().min(2, 'Guardian Name is required'),
  guardianPhone: z.string().min(10, 'Guardian Phone must be at least 10 digits'),
  guardianEmail: z.string().email('Invalid email').optional().nullable(),
  address: z.string().min(5, 'Provide logical address details'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be exactly 6 digits'),
  course: z.string().min(1, 'Selected course stream is mandatory'),
  department: z.string().min(1, 'Department is required'),
  semester: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1).max(8)),
  year: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1).max(4)),
  rollNumber: z.string().min(5, 'Roll number is required'),
  batch: z.string().min(4, 'Batch info is required')
});

export const loginSchema = z.object({
  loginIdentifier: z.string().min(1, 'Email or Student ID is required'), // accepts email or studentId
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  guardianName: z.string().min(2).optional(),
  guardianPhone: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional()
});

export const applicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  course: z.string().min(1),
  department: z.string().min(1),
  dob: z.string().transform(val => new Date(val)),
  gender: z.string(),
  category: z.string(),
  bloodGroup: z.string(),
  guardianName: z.string(),
  guardianPhone: z.string().min(10),
  address: z.string().min(5),
  city: z.string(),
  state: z.string(),
  pincode: z.string().regex(/^\d{6}$/),
  highSchoolMarks: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(0).max(100)),
  intermediateMarks: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().min(0).max(100)),
});

export const examFormSchema = z.object({
  semester: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1).max(8)),
  academicYear: z.string().min(4),
  subjects: z.array(z.string()).min(1, 'Select at least one subject examine syllabus'),
  isBacklog: z.boolean().default(false),
  backlogSubjects: z.array(z.string()).optional().default([])
});

export const paymentSchema = z.object({
  amount: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().positive()),
  purpose: z.string().min(1, 'Specify payment target/head detail'),
  paymentGateway: z.string().min(1),
  admissionApplicationId: z.string().uuid().optional().nullable(),
  examFormId: z.string().uuid().optional().nullable()
});

export const adminCreateSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['SUPER_ADMIN', 'ACADEMIC_ADMIN', 'FEES_ADMIN', 'ATTENDANCE_ADMIN', 'CARD_ISSUER']),
  permissions: z.array(z.string()).optional().default([])
});

export const settingsSchema = z.object({
  collegeName: z.string().min(3),
  shortName: z.string().min(2),
  address: z.string().min(5),
  email: z.string().email(),
  phone: z.string(),
  website: z.string().url(),
  logoUrl: z.string().url().optional().nullable(),
  establishedYear: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().positive()),
  currentAcademicYear: z.string(),
  applicationFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  admissionFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  semesterFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  examFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  backlogSubjectFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  lateFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  hostelFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  messFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  busFee: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().nonnegative()),
  cardValidityYears: z.union([z.number(), z.string().transform(Number)]).pipe(z.number().int().min(1)),
  allowDigitalIDCheckout: z.boolean().default(true)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please write institutional email')
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, 'OTP token must be a 6 digit sequence'),
  newPassword: z.string().min(6, 'New Password must specify at least 6 characters')
});
