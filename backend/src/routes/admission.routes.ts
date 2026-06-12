import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  submitApplication,
  getMyApplications,
  getApplicationStatus,
  updateApplication,
  payApplicationFee,
  downloadAdmissionLetter,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  bulkApproveApplications,
  sendOfferLetters,
  generateMeritList,
  getMeritList
} from '../controllers/admission.controller';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/merit-list', getMeritList);

// ==========================================
// STUDENT & CANDIDATE PROTECTED ROUTES
// ==========================================
router.use(protect);

router.post('/apply', submitApplication);
router.get('/my-applications', getMyApplications);
router.get('/my-applications/:id', getApplicationStatus);
router.put('/my-applications/:id', updateApplication);
router.post('/my-applications/:id/pay', payApplicationFee);
router.get('/my-applications/:id/admission-letter', downloadAdmissionLetter);

// ==========================================
// ADMINISTRATOR EXCLUSIVE ROUTES
// ==========================================
router.use(authorize('SUPER_ADMIN', 'ACADEMIC_ADMIN'));

router.get('/admin/applications', checkPermissions('READ_APPLICATIONS'), getAllApplications);
router.get('/admin/applications/:id', checkPermissions('READ_APPLICATIONS'), getApplicationById);
router.post('/admin/applications/:id/approve', checkPermissions('WRITE_APPLICATIONS'), approveApplication);
router.post('/admin/applications/:id/reject', checkPermissions('WRITE_APPLICATIONS'), rejectApplication);
router.post('/admin/applications/bulk-approve', checkPermissions('WRITE_APPLICATIONS'), bulkApproveApplications);
router.post('/admin/applications/send-offers', checkPermissions('WRITE_APPLICATIONS'), sendOfferLetters);
router.get('/admin/merit-list', checkPermissions('READ_APPLICATIONS'), generateMeritList);

export default router;
