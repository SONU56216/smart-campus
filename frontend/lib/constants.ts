export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  "https://ais-dev-77ydhts23z5gxixr6qaob6-967607588233.asia-southeast1.run.app/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  STUDENT: {
    DASHBOARD: "/student/dashboard",
    ID_CARD: "/student/id-card",
    ADMISSIONS: "/student/admissions",
    EXAMS: "/student/exams",
    PAYMENTS: "/student/payments",
    ATTENDANCE: "/student/attendance",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    ADMISSIONS: "/admin/admissions",
    EXAMS: "/admin/exams",
    PAYMENTS: "/admin/payments",
    ATTENDANCE: "/admin/attendance",
    NOTIFICATIONS: "/admin/notifications",
    SETTINGS: "/admin/settings",
    USERS: "/admin/users",
  },
};

export const COLOR_MAP = {
  // Application statuses
  SUBMITTED: { bg: "bg-blue-50 text-blue-700 border-blue-200", badge: "bg-blue-500" },
  UNDER_REVIEW: { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "bg-amber-500" },
  APPROVED: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-500" },
  REJECTED: { bg: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-500" },
  
  // Payment Statuses
  PENDING: { bg: "bg-amber-50 text-amber-700 border-amber-200", badge: "bg-amber-500" },
  SUCCESS: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-500" },
  FAILED: { bg: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-500" },
  
  // General Roles
  SUPER_ADMIN: { bg: "bg-purple-50 text-purple-700 border-purple-200", badge: "bg-purple-500" },
  ACADEMIC_ADMIN: { bg: "bg-indigo-50 text-indigo-700 border-indigo-200", badge: "bg-indigo-500" },
  FEES_ADMIN: { bg: "bg-teal-50 text-teal-700 border-teal-200", badge: "bg-teal-500" },
  ATTENDANCE_ADMIN: { bg: "bg-sky-50 text-sky-700 border-sky-200", badge: "bg-sky-500" },

  // Attendance Statuses
  PRESENT: { bg: "bg-emerald-50 text-emerald-700 border-cyan-200", badge: "bg-emerald-500" },
  ABSENT: { bg: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-500" },
  LEAVE: { bg: "bg-zinc-50 text-zinc-700 border-zinc-200", badge: "bg-zinc-400" },

  // Cards
  ACTIVE: { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-500" },
  SUSPENDED: { bg: "bg-zinc-100 text-zinc-800 border-zinc-300", badge: "bg-zinc-500" },
  EXPIRED: { bg: "bg-rose-50 text-rose-700 border-rose-200", badge: "bg-rose-500" },
};

export const FEE_PURPOSES = [
  { value: "ADMISSION_APPLICATION_FEE", label: "Admission Application Fee" },
  { value: "SEMESTER_TUITION_FEE", label: "Semester Tuition Fee" },
  { value: "SEMESTER_EXAM_FEE", label: "Semester Examination Fee" },
  { value: "HOSTEL_FEE", label: "Hostel Fee" },
  { value: "MESS_FEE", label: "Mess Fee" },
  { value: "TRANSPORTATION_FEE", label: "Transportation Fee" },
  { value: "WALLET_TOPUP", label: "ID Card Wallet Topup" },
];

export const COURSES = [
  "B.Tech in Computer Science & Engineering",
  "B.Tech in Electronics & Communication",
  "B.Tech in Mechanical Engineering",
  "M.B.A in Information Technology",
  "M.C.A in Application Development",
  "B.Sc in Data Science",
];

export const DEPARTMENTS = [
  "Department of Computer Science & Applications",
  "Department of Electronics & Communication",
  "Department of Mechanical Engineering",
  "Department of Business Management",
  "Department of Applied Mathematics",
];

export const BANKING_GATEWAYS = [
  { value: "RAZORPAY", label: "Standard Card Checkout" },
  { value: "UPI", label: "Instant BHIM UPI Gateway" },
  { value: "NET_BANKING", label: "Interbank Netbanking Portals" },
];
