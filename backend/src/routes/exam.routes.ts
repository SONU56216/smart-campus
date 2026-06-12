import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  getAvailableExams,
  submitExamForm,
  getMyExamForms,
  getExamFormById,
  payExamFee,
  getMyAdmitCards,
  downloadAdmitCard,
  addAdmitCardToWallet,
  getExamSchedule,
  getResults,
  getAllExamForms,
  verifyExamForm,
  generateAdmitCards,
  updateExamSchedule,
  assignExamSeats,
  uploadMarks,
  publishResults
} from '../controllers/exam.controller';

const router = Router();

// ==========================================
// OPEN / PUBLIC ROUTES
// ==========================================
router.get('/schedule', getExamSchedule);

// ==========================================
// STUDENT EXAM CARD PROCEDURES
// ==========================================
router.use(protect);

router.get('/available', getAvailableExams);
router.post('/submit', submitExamForm);
router.get('/my-forms', getMyExamForms);
router.get('/my-forms/:id', getExamFormById);
router.post('/my-forms/:id/pay', payExamFee);
router.get('/my-admit-cards', getMyAdmitCards);
router.get('/my-admit-cards/:cardId/download', downloadAdmitCard);
router.post('/my-admit-cards/:cardId/wallet', addAdmitCardToWallet);
router.get('/results', getResults);

// ==========================================
// ACADEMIC ADMINISTRATORS ONLY ROUTES
// ==========================================
router.use(authorize('SUPER_ADMIN', 'ACADEMIC_ADMIN'));

router.get('/admin/forms', checkPermissions('READ_EXAMS'), getAllExamForms);
router.post('/admin/forms/:id/verify', checkPermissions('WRITE_EXAMS'), verifyExamForm);
router.post('/admin/admit-cards/generate', checkPermissions('WRITE_EXAMS'), generateAdmitCards);
router.post('/admin/schedule', checkPermissions('WRITE_EXAMS'), updateExamSchedule);
router.post('/admin/seating', checkPermissions('WRITE_EXAMS'), assignExamSeats);
router.post('/admin/marks/upload', checkPermissions('WRITE_EXAMS'), uploadMarks);
router.post('/admin/results/publish', checkPermissions('WRITE_EXAMS'), publishResults);

export default router;
