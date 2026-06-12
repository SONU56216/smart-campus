import { Router } from 'express';
import { protect, authorize, checkPermissions } from '../middleware/auth';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentReceipt,
  getPaymentHistory,
  requestRefund,
  getAllPayments,
  getPendingPayments,
  reconcilePayment,
  markAsPaid,
  generatePaymentReport,
  exportPayments
} from '../controllers/payment.controller';

const router = Router();

// ==========================================
// STUDENT TRANSACT SERVICES
// ==========================================
router.use(protect);

router.post('/checkout', createPaymentOrder);
router.post('/confirm', verifyPayment);
router.get('/receipt/:id', getPaymentReceipt);
router.get('/history', getPaymentHistory);
router.post('/refund/:id', requestRefund);

// ==========================================
// FEES DEPT / LEDGER ADMINS
// ==========================================
router.use(authorize('SUPER_ADMIN', 'FEES_ADMIN'));

router.get('/admin/transactions', checkPermissions('READ_PAYMENTS'), getAllPayments);
router.get('/admin/pending', checkPermissions('READ_PAYMENTS'), getPendingPayments);
router.post('/admin/reconcile/:id', checkPermissions('WRITE_PAYMENTS'), reconcilePayment);
router.post('/admin/override/:id', checkPermissions('WRITE_PAYMENTS'), markAsPaid);
router.get('/admin/reporting', checkPermissions('READ_PAYMENTS'), generatePaymentReport);
router.get('/admin/export', checkPermissions('READ_PAYMENTS'), exportPayments);

export default router;
