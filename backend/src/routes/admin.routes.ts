import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  blockStudentCard,
  unblockStudentCard,
  resetStudentPassword,
  bulkImportStudents,
  exportStudents,
  bulkAction
} from '../controllers/admin.controller';
import { protect, authorize } from '../middleware/auth';
import { uploadCSV } from '../middleware/upload';

const router = Router();

// Apply administrative credentials layer globally over this module
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ACADEMIC_ADMIN', 'FEES_ADMIN', 'ATTENDANCE_ADMIN', 'CARD_ISSUER'));

// 1. Core student collection routes
router.get('/students', getAllStudents);
router.post('/students', createStudent);

// 2. CSV Import/Export file operations
router.post('/students/import', uploadCSV.single('file'), bulkImportStudents);
router.get('/students/export/csv', exportStudents);

// 3. Batch administrative operations
router.post('/students/bulk-action', bulkAction);

// 4. Individual student tracking & mutation routing
router.get('/students/:id', getStudentById);
router.patch('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// 5. Credential lifecycle management
router.post('/students/:id/block', blockStudentCard);
router.post('/students/:id/unblock', unblockStudentCard);
router.post('/students/:id/reset-password', resetStudentPassword);

export default router;
