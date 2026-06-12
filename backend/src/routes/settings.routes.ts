import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import { getSettings, updateSettings, uploadLogo } from '../controllers/settings.controller';
import { uploadPhoto } from '../middleware/upload';

const router = Router();

// ==========================================
// INSTITUTIONAL PUBLIC PARAMETERS
// ==========================================
router.get('/', getSettings); // Public can view university details

// ==========================================
// MODIFY REGISTRATION RULES (SUPER_ADMIN ONLY)
// ==========================================
router.use(protect);
router.use(authorize('SUPER_ADMIN'));

router.put('/update', checkPermissions('ALL_ACCESS'), updateSettings);
router.post('/logo', checkPermissions('ALL_ACCESS'), uploadPhoto.single('logo'), uploadLogo);

export default router;
