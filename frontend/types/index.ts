/**
 * ============================================================================
 * CAMPUSPASS CORE TYPES & DATAMODELS
 * ============================================================================
 */

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: {
    applications?: T[];
    examForms?: T[];
    payments?: T[];
    attendance?: T[];
    pagination: {
      page: number;
      limit: number;
      totalEntries: number;
      totalPages: number;
    };
  };
}

export type Role = 'SUPER_ADMIN' | 'ACADEMIC_ADMIN' | 'FEES_ADMIN' | 'ATTENDANCE_ADMIN';

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  address: string;
  rollNumber: string;
  course: string;
  department: string;
  semester: number;
  batch: string;
  photo: string;
  signature?: string;
  cardStatus: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  walletBalance: number;
  isActive: boolean;
  rfidCardUid?: string;
  barcodeData?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  studentId?: string | null;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  highSchoolMarks: number;
  intermediateMarks: number;
  course: string;
  department: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  feePaid: number;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Partial<Student> | null;
  payments?: Payment[];
}

export interface ExamForm {
  id: string;
  studentId: string;
  semester: number;
  academicYear: string;
  subjects: string[];
  isBacklog: boolean;
  backlogSubjects: string[];
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  examFee: number;
  lateFee: number;
  totalPaid: number;
  remarks?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Partial<Student>;
  admitCards?: AdmitCard[];
  payments?: Payment[];
}

export interface AdmitCard {
  id: string;
  studentId: string;
  examFormId: string;
  rollNumber: string;
  academicYear: string;
  semester: number;
  examCenter: string;
  qrCodeData: string;
  isReleased: boolean;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  examForm?: ExamForm;
}

export interface Payment {
  id: string;
  transactionId: string;
  gatewayTransactionId?: string | null;
  studentId?: string | null;
  admissionApplicationId?: string | null;
  examFormId?: string | null;
  amount: number;
  purpose: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentGateway: 'RAZORPAY' | 'UPI' | 'NET_BANKING' | 'CASH';
  createdAt: string;
  updatedAt: string;
  student?: Partial<Student> | null;
  admissionApplication?: Partial<AdmissionApplication> | null;
  examForm?: Partial<ExamForm> | null;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  checkedInAt: string;
  checkedOutAt?: string | null;
  method: 'QR_SCAN' | 'BIOMETRIC' | 'MANUAL';
  location: string;
  verifiedByAdmin?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
}

export interface Notification {
  id: string;
  studentId?: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  student?: Partial<Student> | null;
}

export interface CollegeSettings {
  id: string;
  collegeName: string;
  shortName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  establishedYear: number;
  currentAcademicYear: string;
  applicationFee: number;
  admissionFee: number;
  semesterFee: number;
  examFee: number;
  backlogSubjectFee: number;
  lateFee: number;
  hostelFee: number;
  messFee: number;
  busFee: number;
  cardValidityYears: number;
  allowDigitalIDCheckout: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardData {
  rollNumber: string;
  fullName: string;
  course: string;
  department: string;
  photo: string;
  barcodeData: string;
  validUntil: string;
}

/**
 * ============================================================================
 * AUTHENTICATION FORM TRANSFER OBJECTS
 * ============================================================================
 */
export interface UserState {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | Role;
  studentId?: string; // Holds standard user profile ID inside student table
  permissions?: string[];
}
