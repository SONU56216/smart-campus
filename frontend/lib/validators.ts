import { z } from "zod";

/**
 * 1. Authentication Schemas
 */
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid academic email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum(["STUDENT", "SUPER_ADMIN", "ACADEMIC_ADMIN", "FEES_ADMIN", "ATTENDANCE_ADMIN"]),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().regex(/^\+?[0-9]{10,12}$/, "Please enter a valid 10-12 digit contact number."),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Specify DOB in YYYY-MM-DD format."),
  gender: z.enum(["Male", "Female", "Other"]),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  address: z.string().min(10, "Address must be at least 10 characters long."),
  course: z.string().min(2, "Select a valid degree course."),
  department: z.string().min(2, "Select a valid department."),
  semester: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1).max(8)),
  batch: z.string().regex(/^\d{4}-\d{4}$/, "Specify batch in YYYY-YYYY format."),
  password: z.string().min(6, "Choose a password (min 6 characters)."),
});

/**
 * 2. Admission Application Schema
 */
export const applicationSchema = z.object({
  fullName: z.string().min(3, "Candidate full name is required."),
  email: z.string().email("A valid communication email is required."),
  phone: z.string().regex(/^\+?[0-9]{10,12}$/, "Provide a valid 10-12 digit phone number."),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be format YYYY-MM-DD."),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(8, "Detailed demographic address is required."),
  city: z.string().min(2, "City name is required."),
  state: z.string().min(2, "State name is required."),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits."),
  highSchoolMarks: z.preprocess((val) => parseFloat(val as string), z.number().min(33).max(100)),
  intermediateMarks: z.preprocess((val) => parseFloat(val as string), z.number().min(33).max(100)),
  course: z.string().min(2, "Select desired course program."),
  department: z.string().min(2, "Select related administrative department."),
});

/**
 * 3. Exam Form Registration Schema
 */
export const examFormSchema = z.object({
  semester: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1).max(8)),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Academic session year is invalid (e.g. 2025-2026)."),
  subjects: z.array(z.string().min(1)).min(1, "List at least one theoretical paper."),
  isBacklog: z.boolean().default(false),
  backlogSubjects: z.array(z.string()).optional(),
});

/**
 * 4. Payment Creation Schema
 */
export const paymentSchema = z.object({
  amount: z.preprocess((val) => parseFloat(val as string), z.number().positive("Amount must be greater than zero.")),
  purpose: z.string().min(3, "Identify payment ledger purpose allocation."),
  paymentGateway: z.enum(["RAZORPAY", "UPI", "NET_BANKING", "CASH"]),
  admissionApplicationId: z.string().uuid().optional(),
  examFormId: z.string().uuid().optional(),
});

/**
 * 5. College Settings Schema
 */
export const settingsSchema = z.object({
  collegeName: z.string().min(3, "Official University Name is required."),
  shortName: z.string().min(2, "Brand short name is required."),
  address: z.string().min(6, "Physical address description required."),
  email: z.string().email("Institutional contact email is invalid."),
  phone: z.string().min(10, "Provide dynamic contact landlines."),
  website: z.string().url("Official portal URL is incorrect."),
  logoUrl: z.string().url("College logo brand reference URL must be valid.").optional(),
  establishedYear: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1800).max(2100)),
  currentAcademicYear: z.string().regex(/^\d{4}-\d{4}$/, "Set session pattern under YYYY-YYYY."),
  applicationFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  admissionFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  semesterFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  examFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  backlogSubjectFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  lateFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  hostelFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  messFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  busFee: z.preprocess((val) => parseFloat(val as string), z.number().nonnegative()),
  cardValidityYears: z.preprocess((val) => parseInt(val as string, 10), z.number().min(1).max(7)),
  allowDigitalIDCheckout: z.boolean().default(true),
});

/**
 * 6. Admin Create Schema
 */
export const adminCreateSchema = z.object({
  fullName: z.string().min(3, "Provide the administrator employee full name."),
  email: z.string().email("Invalid email address pattern."),
  password: z.string().min(6, "Choose secure account credentials (min 6 characters)."),
  role: z.enum(["SUPER_ADMIN", "ACADEMIC_ADMIN", "FEES_ADMIN", "ATTENDANCE_ADMIN"]),
  permissions: z.array(z.string()).min(1, "Assign at least one dynamic access privilege flag."),
});
