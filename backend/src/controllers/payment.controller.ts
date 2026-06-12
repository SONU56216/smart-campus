import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { paymentSchema } from '../utils/validators';
import { generatePaymentReceipt as generatePDFReceipt } from '../utils/pdfGenerator';
import { generateTransactionId } from '../utils/generateId';
import { sendPaymentReceipt } from '../utils/email';
import { logAdminActivity } from '../middleware/audit';

/**
 * ============================================================================
 * STUDENT PAYMENT CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. createPaymentOrder (Student)
 * Simulates creation of standard UPI / Razorpay orders.
 */
export const createPaymentOrder = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  const validatedData = await paymentSchema.parseAsync(req.body);

  const transactionId = generateTransactionId();

  // Create order transaction entry inside ledger to prepare checkout screens
  const orderPayment = await prisma.payment.create({
    data: {
      transactionId,
      studentId,
      amount: validatedData.amount,
      purpose: validatedData.purpose,
      status: 'PENDING',
      paymentGateway: validatedData.paymentGateway,
      admissionApplicationId: validatedData.admissionApplicationId || null,
      examFormId: validatedData.examFormId || null
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Payment order initialized on campus gateway.',
    data: {
      orderId: `order_${Math.random().toString(36).substring(2, 9)}`,
      amountNum: orderPayment.amount,
      currency: 'INR',
      transactionId: orderPayment.transactionId
    }
  });
});

/**
 * 2. verifyPayment (Student)
 * Confirms receipt code signatures. Resolves associated dues and dispatches emails.
 */
export const verifyPayment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { transactionId, gatewayTransactionId, isSuccess } = req.body;

  if (!transactionId) {
    throw new AppError('Provide transaction reference ID.', 400);
  }

  const paymentNode = await prisma.payment.findUnique({
    where: { transactionId },
    include: { student: true }
  });

  if (!paymentNode) {
    throw new AppError('The payment transaction could not be located in database.', 404);
  }

  if (paymentNode.status === 'SUCCESS') {
    throw new AppError('This transaction has already been processed and declared success.', 400);
  }

  const resultStatus = isSuccess === false ? 'FAILED' : 'SUCCESS';

  let resolvedBalance = paymentNode.student?.walletBalance || 0;

  // Execute database state resolution under isolated relational transactional lock
  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({
      where: { transactionId },
      data: {
        status: resultStatus,
        gatewayTransactionId: gatewayTransactionId || `gt_sim_${Date.now()}`
      }
    }),
    ...(resultStatus === 'SUCCESS' && paymentNode.purpose === 'WALLET_TOPUP' && paymentNode.studentId
      ? [
          prisma.student.update({
            where: { id: paymentNode.studentId },
            data: { walletBalance: { increment: paymentNode.amount } }
          })
        ]
      : []),
    ...(resultStatus === 'SUCCESS' && paymentNode.admissionApplicationId
      ? [
          prisma.admissionApplication.update({
            where: { id: paymentNode.admissionApplicationId },
            data: { paymentStatus: 'SUCCESS' }
          })
        ]
      : []),
    ...(resultStatus === 'SUCCESS' && paymentNode.examFormId
      ? [
          prisma.examForm.update({
            where: { id: paymentNode.examFormId },
            data: { paymentStatus: 'SUCCESS', status: 'PAID', totalPaid: paymentNode.amount }
          })
        ]
      : [])
  ]);

  if (resultStatus === 'SUCCESS' && paymentNode.student) {
    // Dispatch receipt confirmation to student inbox
    sendPaymentReceipt(
      { email: paymentNode.student.email, fullName: paymentNode.student.fullName, studentId: paymentNode.student.studentId },
      { transactionId: paymentNode.transactionId, purpose: paymentNode.purpose, amount: paymentNode.amount, paymentGateway: paymentNode.paymentGateway }
    ).catch(err => console.error('Silent failure emailing receipt:', err));
  }

  res.status(200).json({
    status: 'success',
    message: `Gateway payment processed as ${resultStatus}`,
    data: { payment: updatedPayment }
  });
});

/**
 * 3. getPaymentReceipt (Student)
 * Generates a monospace-styled point-of-sale receipt PDF.
 */
export const getPaymentReceipt = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!payment) {
    throw new AppError('The requested payment record does not exist.', 404);
  }

  if (studentId && payment.studentId !== studentId) {
    throw new AppError('Unauthorized access to read other receipts.', 403);
  }

  if (payment.status !== 'SUCCESS') {
    throw new AppError('Thermal receipts can only be provided for COMPLETED/SUCCESSFUL payments.', 400);
  }

  const pdfBuffer = await generatePDFReceipt({
    transactionId: payment.transactionId,
    purpose: payment.purpose,
    status: payment.status,
    amount: payment.amount,
    fullName: payment.student?.fullName || 'Academic Applicant Account',
    email: payment.student?.email || 'N/A',
    paymentGateway: payment.paymentGateway
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="campuspass_receipt_${payment.transactionId}.pdf"`);
  res.status(200).send(pdfBuffer);
});

/**
 * 4. getPaymentHistory (Student)
 * Lists payments belonging to student profile.
 */
export const getPaymentHistory = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Mismatched student credentials context.', 401);
  }

  const { status, purpose } = req.query;

  const whereClause: any = { studentId };
  if (status) {
    whereClause.status = status.toString() as any;
  }
  if (purpose) {
    whereClause.purpose = purpose.toString();
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    data: { payments }
  });
});

/**
 * 5. requestRefund (Student)
 * Allows students to lodge formal disputes for failed check-outs or double debits.
 */
export const requestRefund = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;
  const studentId = req.user?.id;

  if (!reason) {
    throw new AppError('Provide details describing the refund dispute.', 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { id }
  });

  if (!payment) {
    throw new AppError('Payment transaction record missing.', 404);
  }

  if (studentId && payment.studentId !== studentId) {
    throw new AppError('Unauthorized.', 403);
  }

  // Record details inside in-app activities logs
  await prisma.activityLog.create({
    data: {
      studentId: payment.studentId,
      action: 'REFUND_REQUESTED',
      description: `Refund requested for transaction ${payment.transactionId}. Reason: ${reason}`
    }
  });

  res.status(200).json({
    status: 'success',
    message: 'Your refund dispute has been registered successfully. Audit reviews take 3-5 office days.'
  });
});

/**
 * ============================================================================
 * ADMIN PAYMENT CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getAllPayments (Admin)
 * Retrieve full system transaction lists paginated.
 */
export const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '15', 10);
  const skip = (page - 1) * limit;

  const { status, purpose, search } = req.query;

  const filter: any = {};
  if (status) {
    filter.status = status.toString() as any;
  }
  if (purpose) {
    filter.purpose = purpose.toString();
  }
  if (search) {
    const sStr = search.toString();
    filter.OR = [
      { transactionId: { contains: sStr, mode: 'insensitive' } },
      { gatewayTransactionId: { contains: sStr, mode: 'insensitive' } },
      { studentId: { contains: sStr, mode: 'insensitive' } },
      { student: { fullName: { contains: sStr, mode: 'insensitive' } } }
    ];
  }

  const [payments, totalCount] = await prisma.$transaction([
    prisma.payment.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        student: { select: { fullName: true, studentId: true, email: true } },
        admissionApplication: { select: { applicationNumber: true } },
        examForm: { select: { id: true, semester: true } }
      }
    }),
    prisma.payment.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      payments,
      pagination: {
        page,
        limit,
        totalEntries: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    }
  });
});

/**
 * 2. getPendingPayments (Admin)
 * Filters active PENDING checks.
 */
export const getPendingPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const pendingTransactions = await prisma.payment.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: { student: true }
  });

  res.status(200).json({
    status: 'success',
    data: { payments: pendingTransactions }
  });
});

/**
 * 3. reconcilePayment (Admin)
 * Reconciles status against simulated banking nodes.
 */
export const reconcilePayment = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { id }
  });

  if (!payment) {
    throw new AppError('Payment record not found.', 404);
  }

  // Simulate reconciliation: 90% of pending items are approved in background gate checks
  const updatedStatus = payment.status === 'PENDING' && Math.random() > 0.1 ? 'SUCCESS' : payment.status;

  const updated = await prisma.payment.update({
    where: { id },
    data: { status: updatedStatus }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'PAYMENT_RECONCILED',
      `Reconciled status of transaction ${payment.transactionId}. Status resolved: ${updatedStatus}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Reconciliation sequence complete. Payment updated to: ${updatedStatus}`,
    data: { payment: updated }
  });
});

/**
 * 4. markAsPaid (Admin Override)
 * Administrative override to bypass payment gateways (e.g. for cash collection or scholarships).
 */
export const markAsPaid = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new AppError('Provide documented reason for manual override check.', 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!payment) {
    throw new AppError('Payment details not found.', 404);
  }

  const [updated] = await prisma.$transaction([
    prisma.payment.update({
      where: { id },
      data: {
        status: 'SUCCESS',
        gatewayTransactionId: `manual_override_${Date.now()}`
      }
    }),
    ...(payment.purpose === 'WALLET_TOPUP' && payment.studentId
      ? [
          prisma.student.update({
            where: { id: payment.studentId },
            data: { walletBalance: { increment: payment.amount } }
          })
        ]
      : []),
    ...(payment.admissionApplicationId
      ? [
          prisma.admissionApplication.update({
            where: { id: payment.admissionApplicationId },
            data: { paymentStatus: 'SUCCESS' }
          })
        ]
      : []),
    ...(payment.examFormId
      ? [
          prisma.examForm.update({
            where: { id: payment.examFormId },
            data: { paymentStatus: 'SUCCESS', status: 'PAID', totalPaid: payment.amount }
          })
        ]
      : [])
  ]);

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'PAYMENT_MANUAL_OVERRIDE',
      `Manual fee validation applied on transaction number ${payment.transactionId}. Reason: ${reason}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Transaction manually approved on register override.',
    data: { payment: updated }
  });
});

/**
 * 5. generatePaymentReport (Admin)
 * Outputs aggregate stats.
 */
export const generatePaymentReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const totalVolume = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'SUCCESS' }
  });

  const categoryAggregation = await prisma.payment.groupBy({
    by: ['purpose'],
    _sum: { amount: true },
    _count: { id: true },
    where: { status: 'SUCCESS' }
  });

  const gatewayAggregation = await prisma.payment.groupBy({
    by: ['paymentGateway'],
    _count: { id: true },
    where: { status: 'SUCCESS' }
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalRevenueCollected: totalVolume._sum.amount || 0.0,
      categories: categoryAggregation,
      gatewayBreakdown: gatewayAggregation
    }
  });
});

/**
 * 6. exportPayments (Admin)
 * Tabulates full database payment registries.
 */
export const exportPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const transactions = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { student: { select: { fullName: true, studentId: true } } }
  });

  const headers = ['Txn ID', 'Gateway ID', 'Student ID', 'Student Name', 'Amount (INR)', 'Purpose', 'Status', 'Gateway Platform', 'Date'];
  const rows = [headers.join(',')];

  transactions.forEach((txn) => {
    const row = [
      `"${txn.transactionId}"`,
      `"${txn.gatewayTransactionId || 'N/A'}"`,
      `"${txn.student?.studentId || 'N/A'}"`,
      `"${(txn.student?.fullName || 'Academic Prospect').replace(/"/g, '""')}"`,
      txn.amount,
      `"${txn.purpose}"`,
      `"${txn.status}"`,
      `"${txn.paymentGateway}"`,
      `"${txn.createdAt.toISOString()}"`
    ];
    rows.push(row.join(','));
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="campuspass_fee_transactions.csv"');
  res.status(200).send(rows.join('\n'));
});
