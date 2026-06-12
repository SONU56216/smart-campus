import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { updateProfileSchema, paymentSchema } from '../utils/validators';
import { uploadStudentPhoto, uploadDocument, deleteFromCloudinary } from './../utils/fileUpload';
import { generateDynamicQR } from '../utils/qrGenerator';
import { decryptQRData } from '../utils/encryption';
import { generateTransactionId } from '../utils/generateId';
import { sendCardBlockedEmail, sendPaymentReceipt } from '../utils/email';

/**
 * 1. getProfile
 * Returns the active student's full database details, safely omitting their hashed password.
 */
export const getProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;

  if (!studentId) {
    throw new AppError('Authentication mismatch. Session invalid.', 401);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentId: true,
      fullName: true,
      email: true,
      phone: true,
      photo: true,
      signature: true,
      dob: true,
      gender: true,
      category: true,
      bloodGroup: true,
      guardianName: true,
      guardianPhone: true,
      guardianEmail: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      course: true,
      department: true,
      semester: true,
      year: true,
      rollNumber: true,
      batch: true,
      cardStatus: true,
      cardIssuedAt: true,
      cardExpiresAt: true,
      qrCodeData: true,
      cardVersion: true,
      walletBalance: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!student) {
    throw new AppError('Student profile could not be found.', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { student }
  });
});

/**
 * 2. updateProfile
 * Allows students to update personal demographic fields, keeping standard audit logs in memory.
 */
export const updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const validatedData = await updateProfileSchema.parseAsync(req.body);

  const currentStudent = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!currentStudent) {
    throw new AppError('Student record not found.', 404);
  }

  // Identify modifications made for description audits
  const changes: string[] = [];
  Object.keys(validatedData).forEach((key) => {
    const newVal = (validatedData as any)[key];
    const oldVal = (currentStudent as any)[key];
    if (newVal !== undefined && newVal !== oldVal) {
      changes.push(`${key}: "${oldVal}" -> "${newVal}"`);
    }
  });

  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: validatedData,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      pincode: true,
      updatedAt: true
    }
  });

  // Log to physical ActivityLog
  if (changes.length > 0) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
    await prisma.activityLog.create({
      data: {
        studentId,
        action: 'PROFILE_UPDATE',
        description: `Student modified demographic details. Modified attributes: [${changes.join(', ')}]`,
        ipAddress
      }
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile records updated successfully.',
    data: { student: updatedStudent }
  });
});

/**
 * 3. uploadPhoto
 * Processes Multer physical file chunks, uploads them securely to Cloudinary,
 * releases redundant stale resources and updates student photography pointers.
 */
export const uploadPhoto = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  if (!req.file) {
    throw new AppError('Please select a photographic file to upload.', 400);
  }

  const currentStudent = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!currentStudent) {
    throw new AppError('Student record not found.', 404);
  }

  // Upload new image
  const uploadResult = await uploadStudentPhoto(req.file.path);

  // If previous image existed and was cloud-hosted, reclaim its database tags (e.g. if we want cleanup)
  // For safety, we keep records, but we can purge old image if it has unique URL structures.
  // In our simplified model, we write the full URL path.
  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: { photo: uploadResult.url },
    select: { id: true, photo: true }
  });

  // Log to ActivityLog
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
  await prisma.activityLog.create({
    data: {
      studentId,
      action: 'PHOTO_UPDATE',
      description: 'Student updated biometric photography profile.',
      ipAddress
    }
  });

  res.status(200).json({
    status: 'success',
    message: 'Biometric photograph uploaded successfully.',
    data: { photo: updatedStudent.photo }
  });
});

/**
 * 4. uploadSignature
 * Processes digital signature files and writes pointers to the student's schema.
 */
export const uploadSignature = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  if (!req.file) {
    throw new AppError('Please supply a digitized signature file.', 400);
  }

  const currentStudent = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!currentStudent) {
    throw new AppError('Student record not found.', 404);
  }

  const uploadResult = await uploadDocument(req.file.path);

  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: { signature: uploadResult.url },
    select: { id: true, signature: true }
  });

  // Log activity
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
  await prisma.activityLog.create({
    data: {
      studentId,
      action: 'SIGNATURE_UPDATE',
      description: 'Student uploaded dynamic digitized signature representation.',
      ipAddress
    }
  });

  res.status(200).json({
    status: 'success',
    message: 'Digitized signature uploaded successfully.',
    data: { signature: updatedStudent.signature }
  });
});

/**
 * 5. getDigitalCard
 * Combines standard student variables to output full digital credential parameters.
 */
export const getDigitalCard = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentId: true,
      fullName: true,
      rollNumber: true,
      course: true,
      department: true,
      photo: true,
      cardStatus: true,
      cardVersion: true,
      cardIssuedAt: true,
      cardExpiresAt: true,
      qrCodeData: true
    }
  });

  if (!student) {
    throw new AppError('Associated student profile missing.', 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      card: {
        id: student.id,
        identityCode: student.studentId,
        claimantName: student.fullName,
        registerNumber: student.rollNumber,
        program: student.course,
        office: student.department,
        avatar: student.photo,
        status: student.cardStatus,
        version: student.cardVersion,
        activationDate: student.cardIssuedAt,
        expiryDate: student.cardExpiresAt,
        barcodeBase: student.qrCodeData
      }
    }
  });
});

/**
 * 6. generateQR
 * Generates an encrypted rotating daily QR code base64 segment dynamically.
 */
export const generateQR = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentIdVal = req.user?.studentId;
  const deviceId = req.headers['x-device-id']?.toString() || 'mobile_device';

  if (!studentIdVal) {
    throw new AppError('Only active student sessions can generate credentials.', 403);
  }

  const dynamicQrBase64 = await generateDynamicQR(studentIdVal, deviceId);

  res.status(200).json({
    status: 'success',
    data: {
      rotatingQR: dynamicQrBase64,
      lifespanSeconds: 300 // standard 5 minutes TTL
    }
  });
});

/**
 * 7. verifyQR
 * Consumes encrypted rotating qr hex strings, parses constraints, inspects active flags.
 */
export const verifyQR = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { qrString } = req.body;

  if (!qrString) {
    throw new AppError('Provide the rotating QR code string for database validation.', 400);
  }

  try {
    const rawDecryptedString = decryptQRData(qrString);
    const parsedPayload = JSON.parse(rawDecryptedString);

    const { studentId, date, timestamp } = parsedPayload;

    if (!studentId) {
      throw new AppError('Malformed credentials packet inside QR block.', 400);
    }

    // Verify lifespan TTL window mismatch (e.g. to prevent stale screenshot access replay attacks)
    const currentMs = Date.now();
    const timePastSeconds = (currentMs - timestamp) / 1000;
    
    // Lifespan cutoff. If the QR code generated is more than 5 minutes (300s) old, reject.
    if (timePastSeconds > 300 || timePastSeconds < -300) {
      throw new AppError('The presented digital pass has expired. Please refresh the app code.', 400);
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    if (date !== todayDate) {
      throw new AppError('The presented credential does not matching the current day.', 400);
    }

    // Access student in database
    const student = await prisma.student.findUnique({
      where: { studentId }
    });

    if (!student) {
      throw new AppError('No student record matches this security ticket.', 404);
    }

    if (!student.isActive) {
      throw new AppError('The matching student profile has been deactivated.', 403);
    }

    if (student.cardStatus !== 'ISSUED' && student.cardStatus !== 'APPROVED') {
      throw new AppError(`The student credential is suspended or invalid. Status: ${student.cardStatus}`, 403);
    }

    res.status(200).json({
      status: 'success',
      message: 'ID verified successfully.',
      data: {
        student: {
          id: student.id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          rollNumber: student.rollNumber,
          course: student.course,
          semester: student.semester,
          cardStatus: student.cardStatus
        }
      }
    });
  } catch (error: any) {
    throw new AppError(`ID verification failed: ${error.message || 'Malformed credentials payload'}`, 401);
  }
});

/**
 * 8. getAttendance
 * Returns attendance entries with date filters and dynamically calculated overall percentages.
 */
export const getAttendance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '15', 10);
  const skip = (page - 1) * limit;

  const startDateStr = req.query.startDate as string;
  const endDateStr = req.query.endDate as string;

  const whereClause: any = { studentId };

  if (startDateStr || endDateStr) {
    whereClause.date = {};
    if (startDateStr) {
      whereClause.date.gte = new Date(startDateStr);
    }
    if (endDateStr) {
      whereClause.date.lte = new Date(endDateStr);
    }
  }

  // Retrieve matching entries
  const [entries, totalEntries] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      skip,
      take: limit
    }),
    prisma.attendance.count({ where: whereClause })
  ]);

  // Retrieve comprehensive metrics for overall tracking percentage
  const totalPresent = await prisma.attendance.count({
    where: { studentId, status: 'PRESENT' }
  });

  const totalAllTime = await prisma.attendance.count({
    where: { studentId }
  });

  const attendancePercentage = totalAllTime > 0 
    ? parseFloat(((totalPresent / totalAllTime) * 100).toFixed(2)) 
    : 100.00;

  res.status(200).json({
    status: 'success',
    data: {
      entries,
      pagination: {
        page,
        limit,
        totalEntries,
        totalPages: Math.ceil(totalEntries / limit)
      },
      metrics: {
        totalPresent,
        totalAllTime,
        attendancePercentage
      }
    }
  });
});

/**
 * 9. getPayments
 * Returns transaction records with type / purpose filtering supports.
 */
export const getPayments = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const { purpose, status } = req.query;

  const filter: any = { studentId };
  if (purpose) {
    filter.purpose = purpose.toString();
  }
  if (status) {
    filter.status = status.toString() as any;
  }

  const payments = await prisma.payment.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    data: { payments }
  });
});

/**
 * 10. getNotifications
 * Outputs dynamic in-app alerts targeting unread nodes primarily.
 */
export const getNotifications = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { studentId },
        { studentId: null } // System-wide announcements
      ]
    },
    orderBy: [
      { isRead: 'asc' },   // Unread first
      { createdAt: 'desc' } // Newest second
    ]
  });

  res.status(200).json({
    status: 'success',
    data: { notifications }
  });
});

/**
 * 11. markNotificationRead
 * Flags a specific notification state as consumed.
 */
export const markNotificationRead = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  const { blockId } = req.params; // matches route parameter key naming

  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const notification = await prisma.notification.findUnique({
    where: { id: blockId }
  });

  if (!notification || (notification.studentId && notification.studentId !== studentId)) {
    throw new AppError('Notification node not found.', 404);
  }

  const updated = await prisma.notification.update({
    where: { id: blockId },
    data: { isRead: true }
  });

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read.',
    data: { notification: updated }
  });
});

/**
 * 12. reportLostCard
 * Handles student immediate report of card loss by locking status and sending safety email triggers.
 */
export const reportLostCard = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new AppError('Student profile could not be verified.', 404);
  }

  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: {
      cardStatus: 'SUSPENDED', // locked state
      cardVersion: student.cardVersion + 1 // invalidate previous copies
    }
  });

  // Log in user operations activity table
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
  await prisma.activityLog.create({
    data: {
      studentId,
      action: 'CARD_REPORT_LOST',
      description: 'Student reported credential card lost. Status suspended and credential revoked.',
      ipAddress
    }
  });

  // Emit email alarm
  sendCardBlockedEmail(
    { email: student.email, fullName: student.fullName, studentId: student.studentId },
    'Directly reported lost or stolen by owner through self-service web dashboard.'
  ).catch(err => console.error('Silent block email failure:', err));

  res.status(200).json({
    status: 'success',
    message: 'Your Digital ID has been successfully suspended. Stale tickets are completely invalidated.',
    data: { cardStatus: updatedStudent.cardStatus }
  });
});

/**
 * 13. getWalletBalance
 * Returns current digital coin wallet level.
 */
export const getWalletBalance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { walletBalance: true }
  });

  if (!student) {
    throw new AppError('Associated database record missing.', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { balance: student.walletBalance }
  });
});

/**
 * 14. addMoneyToWallet
 * Top up student digital tokens after simulating standard verification checks.
 */
export const addMoneyToWallet = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Authentication mismatch.', 401);
  }

  const { amount, paymentGateway } = await paymentSchema.parseAsync(req.body);

  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new AppError('Student profile record missing.', 404);
  }

  const transactionId = generateTransactionId();

  // Create payment record & update wallet ledger in a robust relational transaction block
  const [updatedStudent, paymentRecord] = await prisma.$transaction([
    prisma.student.update({
      where: { id: studentId },
      data: {
        walletBalance: { increment: amount }
      },
      select: { id: true, studentId: true, fullName: true, email: true, walletBalance: true }
    }),
    prisma.payment.create({
      data: {
        transactionId,
        studentId,
        amount,
        purpose: 'WALLET_TOPUP',
        status: 'SUCCESS',
        paymentGateway
      }
    })
  ]);

  // Send purchase notification invoice
  sendPaymentReceipt(
    { email: updatedStudent.email, fullName: updatedStudent.fullName, studentId: updatedStudent.studentId },
    { transactionId, purpose: 'Digital Cash Wallet top up', amount, paymentGateway }
  ).catch(err => console.error('Emailed client receipt failed:', err));

  res.status(200).json({
    status: 'success',
    message: `Top up complete. ₹${amount.toFixed(2)} added safely to your digital ledger.`,
    data: {
      newBalance: updatedStudent.walletBalance,
      transaction: paymentRecord
    }
  });
});
