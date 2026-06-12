import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadPhoto as uploadStudentPhotoController,
  uploadSignature as uploadStudentSignatureController,
  getDigitalCard,
  generateQR,
  verifyQR,
  getAttendance,
  getPayments,
  getNotifications,
  markNotificationRead,
  reportLostCard,
  getWalletBalance,
  addMoneyToWallet
} from '../controllers/student.controller';
import { protect } from '../middleware/auth';
import { uploadPhoto, uploadDocument } from '../middleware/upload';

const router = Router();

// Apply session guard to all student routes
router.use(protect);

// 1. Profile information routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// 2. Document upload routes (Multer single storage handlers)
router.post('/upload-photo', uploadPhoto.single('photo'), uploadStudentPhotoController);
router.post('/upload-signature', uploadDocument.single('signature'), uploadStudentSignatureController);

// 3. Digital ID Card configurations
router.get('/digital-card', getDigitalCard);
router.get('/generate-qr', generateQR);
router.post('/verify-qr', verifyQR);

// 4. Attendance metrics
router.get('/attendance', getAttendance);

// 5. Transaction log ledgers
router.get('/payments', getPayments);

// 6. In-App Announcements & Alerts
router.get('/notifications', getNotifications);
router.patch('/notifications/:blockId/read', markNotificationRead);

// 7. Emergency reports
router.post('/report-lost', reportLostCard);

// 8. Wallet financial states
router.get('/wallet', getWalletBalance);
router.post('/wallet/topup', addMoneyToWallet);

export default router;
