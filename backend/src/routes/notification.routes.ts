import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  sendToStudent,
  sendToAll,
  sendToGroup,
  getNotificationHistory,
  deleteNotification
} from '../controllers/notification.controller';

const router = Router();

// Only protected administrative users can send alerts or manage history
router.use(protect);
router.use(authorize('SUPER_ADMIN', 'ACADEMIC_ADMIN', 'FEES_ADMIN', 'ATTENDANCE_ADMIN'));

router.post('/student', checkPermissions('WRITE_NOTIFICATIONS'), sendToStudent);
router.post('/broadcast', checkPermissions('WRITE_NOTIFICATIONS'), sendToAll);
router.post('/cohort', checkPermissions('WRITE_NOTIFICATIONS'), sendToGroup);
router.get('/history', checkPermissions('READ_NOTIFICATIONS'), getNotificationHistory);
router.delete('/:id', checkPermissions('WRITE_NOTIFICATIONS'), deleteNotification);

export default router;
