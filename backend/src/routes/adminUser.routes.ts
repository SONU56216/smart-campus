import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminUser.controller';

const router = Router();

// ==========================================
// SUPER_ADMIN ONLY ACCESS PROTOCOLS
// ==========================================
router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.get('/', checkPermissions('ALL_ACCESS'), getAllAdmins);
router.post('/register', checkPermissions('ALL_ACCESS'), createAdmin);
router.put('/:id', checkPermissions('ALL_ACCESS'), updateAdmin);
router.delete('/:id', checkPermissions('ALL_ACCESS'), deleteAdmin);

export default router;
