import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import adminRoutes from './admin.routes';
import admissionRoutes from './admission.routes';
import examRoutes from './exam.routes';
import paymentRoutes from './payment.routes';
import attendanceRoutes from './attendance.routes';
import notificationRoutes from './notification.routes';
import settingsRoutes from './settings.routes';
import adminUserRoutes from './adminUser.routes';

const router = Router();

// Mounting Auth routing layers
router.use('/auth', authRoutes);

// Mounting Student specific features routing layer (profile, wallet, rotating pass)
router.use('/students', studentRoutes);

// Mounting Admin capabilities routing layer (management ledger, updates, bulk imports)
router.use('/admin', adminRoutes);

// Mounting Part 4 Feature modules
router.use('/admissions', admissionRoutes);
router.use('/exams', examRoutes);
router.use('/payments', paymentRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notifications', notificationRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin/users', adminUserRoutes);

export default router;
