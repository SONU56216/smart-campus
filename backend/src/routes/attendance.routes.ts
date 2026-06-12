import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  markAttendance,
  markAttendanceNFC,
  getMyAttendance,
  getTodayAttendance,
  getAllAttendance,
  updateAttendance,
  bulkMarkAttendance,
  generateAttendanceReport,
  sendLowAttendanceWarning
} from '../controllers/attendance.controller';

const router = Router();

// ==========================================
// PHYSICAL NFC GATES / HARDWARE SENSORS ENDPOINT
// ==========================================
router.post('/hardware/swipe', markAttendanceNFC); // usually auth handled via security secret tokens passed via body headers

// ==========================================
// STUDENT COMMUTE / CLASS TARGETS
// ==========================================
router.use(protect);

router.post('/scan-mark', markAttendance);
router.get('/my-attendance', getMyAttendance);

// ==========================================
// ACADEMIC / ATTENDANCE DEPARTMENTS
// ==========================================
router.use(authorize('SUPER_ADMIN', 'ATTENDANCE_ADMIN'));

router.get('/admin/today', checkPermissions('READ_ATTENDANCE'), getTodayAttendance);
router.get('/admin/register', checkPermissions('READ_ATTENDANCE'), getAllAttendance);
router.put('/admin/register/:id', checkPermissions('WRITE_ATTENDANCE'), updateAttendance);
router.post('/admin/bulk', checkPermissions('WRITE_ATTENDANCE'), bulkMarkAttendance);
router.get('/admin/report', checkPermissions('READ_ATTENDANCE'), generateAttendanceReport);
router.post('/admin/low-alerts', checkPermissions('WRITE_ATTENDANCE'), sendLowAttendanceWarning);

export default router;
