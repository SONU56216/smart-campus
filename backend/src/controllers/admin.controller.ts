import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { hashPassword } from '../utils/password';
import { generateStudentId, generateOTP } from '../utils/generateId';
import { generateStaticQR } from '../utils/qrGenerator';
import { sendEmail, sendWelcomeEmail, sendCardBlockedEmail } from '../utils/email';
import { logAdminActivity } from '../middleware/audit';
import { registerSchema } from '../utils/validators';

/**
 * 1. getAllStudents
 * Returns a paginated list of students, supporting global text searches and field filters.
 */
export const getAllStudents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const skip = (page - 1) * limit;

  const { search, course, semester, year, status, sortBy, sortOrder } = req.query;

  const whereClause: any = {
    // we don't return deactivated student entries unless explicitly requested
    isActive: true
  };

  // Wildcard search across multiple textual criteria
  if (search) {
    const searchString = search.toString();
    whereClause.OR = [
      { fullName: { contains: searchString, mode: 'insensitive' } },
      { studentId: { contains: searchString, mode: 'insensitive' } },
      { email: { contains: searchString, mode: 'insensitive' } },
      { phone: { contains: searchString, mode: 'insensitive' } },
      { rollNumber: { contains: searchString, mode: 'insensitive' } }
    ];
  }

  // Columnar filter bindings
  if (course) {
    whereClause.course = course.toString();
  }
  if (semester) {
    whereClause.semester = parseInt(semester.toString(), 10);
  }
  if (year) {
    whereClause.year = parseInt(year.toString(), 10);
  }
  if (status) {
    // Status maps directly to cardStatus (NOT_APPLIED, ISSUED, etc.)
    whereClause.cardStatus = status.toString() as any;
  }

  // Simple sorting configurations
  const orderKey = sortBy ? sortBy.toString() : 'createdAt';
  const orderDirection = sortOrder === 'asc' ? 'asc' : 'desc';

  const [students, totalCount] = await prisma.$transaction([
    prisma.student.findMany({
      where: whereClause,
      orderBy: { [orderKey]: orderDirection },
      skip,
      take: limit,
      select: {
        id: true,
        studentId: true,
        fullName: true,
        email: true,
        phone: true,
        course: true,
        semester: true,
        year: true,
        rollNumber: true,
        batch: true,
        cardStatus: true,
        isActive: true,
        walletBalance: true,
        createdAt: true
      }
    }),
    prisma.student.count({ where: whereClause })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      students,
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
 * 2. getStudentById
 * Returns detailed fields for an individual student record, joining relational dependencies.
 */
export const getStudentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      admissionApplication: true,
      examForms: true,
      admitCards: true,
      payments: {
        orderBy: { createdAt: 'desc' }
      },
      attendance: {
         take: 50,
         orderBy: { date: 'desc' }
      },
      devices: true,
      notifications: {
        take: 15,
        orderBy: { createdAt: 'desc' }
      },
      activityLogs: {
        take: 20,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!student) {
    throw new AppError('The requested student record could not be located in database.', 404);
  }

  // Omit password field
  const { password, ...safeStudent } = student;

  res.status(200).json({
    status: 'success',
    data: { student: safeStudent }
  });
});

/**
 * 3. createStudent
 * Administrative action to manually insert a student into the system with verified password hashings.
 */
export const createStudent = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const validatedData = await registerSchema.parseAsync(req.body);

  const existing = await prisma.student.findFirst({
    where: {
      OR: [
        { email: validatedData.email },
        { rollNumber: validatedData.rollNumber }
      ],
      isActive: true
    }
  });

  if (existing) {
    throw new AppError('A student record with this institutional email or roll number already exists.', 400);
  }

  const hashedPassword = await hashPassword(validatedData.password);
  const studentId = generateStudentId();
  const validityYears = 4;
  const cardIssuedAt = new Date();
  const cardExpiresAt = new Date();
  cardExpiresAt.setFullYear(cardExpiresAt.getFullYear() + validityYears);

  // Generate static barcode image URL
  const qrCodeDataUrl = await generateStaticQR(`CAM-${studentId}`);

  const newStudent = await prisma.student.create({
    data: {
      ...validatedData,
      studentId,
      password: hashedPassword,
      cardStatus: 'ISSUED',
      cardIssuedAt,
      cardExpiresAt,
      qrCodeData: qrCodeDataUrl,
      cardVersion: 1,
      walletBalance: 0.0,
      isActive: true
    }
  });

  // Log in administrative events log
  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_MANUAL_CREATE',
      `Manual profile creation of student ${newStudent.fullName} (${studentId})`,
      req
    );
  }

  // Trigger welcome thread email
  sendWelcomeEmail({
    email: newStudent.email,
    fullName: newStudent.fullName,
    studentId: newStudent.studentId,
    rollNumber: newStudent.rollNumber
  }).catch(err => console.error('Emailed client welcome letter failure:', err));

  res.status(201).json({
    status: 'success',
    message: 'Student profile created and dynamic card activated successfully.',
    data: {
      studentId: newStudent.studentId,
      rollNumber: newStudent.rollNumber,
      id: newStudent.id
    }
  });
});

/**
 * 4. updateStudent
 * Administrative action to modify ANY field within a student record.
 */
export const updateStudent = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const currentStudent = await prisma.student.findUnique({
    where: { id }
  });

  if (!currentStudent) {
    throw new AppError('No student record found with this ID.', 404);
  }

  const allowedUpdates = { ...req.body };
  // Safety lock: prevent modifying internal keys unless required
  delete allowedUpdates.id;
  delete allowedUpdates.studentId;

  // If updates contain password modification, hash before committing
  if (allowedUpdates.password) {
    allowedUpdates.password = await hashPassword(allowedUpdates.password);
  }

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: allowedUpdates
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_PROFILE_MUTATED',
      `Admin updated profile of student ${updatedStudent.fullName} (${updatedStudent.studentId})`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Student records updated successfully.',
    data: {
      studentId: updatedStudent.studentId,
      fullName: updatedStudent.fullName
    }
  });
});

/**
 * 5. deleteStudent
 * Soft-deletes a student entry, deactivating sessions and card access security boundaries.
 */
export const deleteStudent = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('The student profile was not found.', 404);
  }

  const updated = await prisma.student.update({
    where: { id },
    data: {
      isActive: false,
      cardStatus: 'SUSPENDED'
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_DEACTIVATED',
      `Soft delete/deactivation applied on student ${student.fullName} (${student.studentId})`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Student session and digital pass successfully deactivated.'
  });
});

/**
 * 6. blockStudentCard
 * Flags student's credentials as blocked / suspended.
 */
export const blockStudentCard = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new AppError('State administrative reason is required to block student passes.', 400);
  }

  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Requested student profile missing.', 404);
  }

  const updated = await prisma.student.update({
    where: { id },
    data: {
      cardStatus: 'SUSPENDED',
      cardVersion: { increment: 1 } // locks out cached copies in offline readers
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_CARD_SUSPENDED',
      `Suspended security card of ${student.fullName} (${student.studentId}). Reason: ${reason}`,
      req
    );
  }

  // Trigger immediate warning email alert
  sendCardBlockedEmail(
    { email: student.email, fullName: student.fullName, studentId: student.studentId },
    reason
  ).catch(err => console.error('Warning email dispatch failed:', err));

  res.status(200).json({
    status: 'success',
    message: 'Digital credentials successfully suspended and client notified.'
  });
});

/**
 * 7. unblockStudentCard
 * Restores a suspended digital credential card to approved issued status.
 */
export const unblockStudentCard = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Requested student profile missing.', 404);
  }

  const updated = await prisma.student.update({
    where: { id },
    data: {
      cardStatus: 'ISSUED',
      cardVersion: { increment: 1 }
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_CARD_UNSUSPENDED',
      `Restored suspended credential pass of student ${student.fullName} (${student.studentId})`,
      req
    );
  }

  // Simple reactivation email confirmation
  sendEmail(
    student.email,
    'Your CampusPass Digital ID has been Reactivated',
    `<h2>ID Reactivation Notice</h2><p>Dear ${student.fullName},</p><p>We have successfully reviewed your profile and reactivated your Dynamic digital ID card. You can safely check in now.</p>`
  ).catch(err => console.error('Silent email restore failure:', err));

  res.status(200).json({
    status: 'success',
    message: 'Dynamic access credentials successfully reinstated.'
  });
});

/**
 * 8. resetStudentPassword
 * Generates an auto-assigned security passphrase, hashes it and emails the client.
 */
export const resetStudentPassword = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const student = await prisma.student.findUnique({
    where: { id }
  });

  if (!student) {
    throw new AppError('Requested student profile missing.', 404);
  }

  const tempPass = Math.random().toString(36).substring(2, 10); // temporary 8-char secure pattern
  const hashed = await hashPassword(tempPass);

  await prisma.student.update({
    where: { id },
    data: { password: hashed }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_PASSWORD_RESET_ADMIN',
      `Admin triggered manual password reset of student ${student.fullName} (${student.studentId})`,
      req
    );
  }

  // Despatch temporary credentials directly
  sendEmail(
    student.email,
    'Temporary Access Pass credentials',
    `
    <h2>Password Mutated by Registrar</h2>
    <p>Dear ${student.fullName},</p>
    <p>Your access credentials for CampusPass have been reissued by administration. Here is your temporary credentials passcode:</p>
    <div style="background-color:#f6f9fc; padding:15px; font-weight:bold; font-size:18px; letter-spacing:1px; border-left:4px solid #6200EE; text-align:center;">
       ${tempPass}
    </div>
    <p>Please log in and modify this code immediately within your Transcript details panels.</p>
    `
  ).catch(err => console.error('Password reset email dispatch failure:', err));

  res.status(200).json({
    status: 'success',
    message: 'The temporary password has been successfully dispatched to their institutional inbox.',
    tempPassphrase: process.env.NODE_ENV !== 'production' ? tempPass : undefined
  });
});

/**
 * 9. bulkImportStudents
 * Parses raw multipart CSV data directly, validating objects inside active transactions.
 */
export const bulkImportStudents = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError('Please supply a standard CSV text file containing columns.', 400);
  }

  const csvBuffer = req.file.path;
  const rawData = require('fs').readFileSync(csvBuffer, 'utf8');

  // Basic robust CSV line parser
  const lines = rawData.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h: string) => h.trim());

  let successCount = 0;
  let failureCount = 0;
  const errorsReport: any[] = [];

  // Transaction mapping logic
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',').map((v: string) => v.trim());

    // Map keys to layout
    const item: any = {};
    headers.forEach((hdr: string, idx: number) => {
      item[hdr] = values[idx] || '';
    });

    try {
      // Basic validating requirements
      if (!item.fullName || !item.email || !item.rollNumber || !item.phone) {
        throw new Error('Mandatory credentials (fullName, email, rollNumber, phone) missing.');
      }

      const existingRecord = await prisma.student.findFirst({
        where: {
          OR: [
            { email: item.email },
            { rollNumber: item.rollNumber }
          ]
        }
      });

      if (existingRecord) {
        throw new Error('This email or roll number is already associated with an existing student.');
      }

      const studentId = generateStudentId();
      // Auto-assign random default pass string if not supplied
      const defaultPass = item.password || `Welcome@${Math.floor(1000 + Math.random() * 9000)}`;
      const hashedPass = await hashPassword(defaultPass);

      const validityYears = 4;
      const cardIssuedAt = new Date();
      const cardExpiresAt = new Date();
      cardExpiresAt.setFullYear(cardExpiresAt.getFullYear() + validityYears);
      const barcode = await generateStaticQR(`CAM-${studentId}`);

      await prisma.student.create({
        data: {
          studentId,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          password: hashedPass,
          dob: item.dob ? new Date(item.dob) : new Date('2002-01-01'),
          gender: item.gender || 'Other',
          category: item.category || 'General',
          bloodGroup: item.bloodGroup || 'O+',
          guardianName: item.guardianName || 'Guardian',
          guardianPhone: item.guardianPhone || item.phone,
          address: item.address || 'Campus Hostels',
          city: item.city || 'Campus City',
          state: item.state || 'State',
          pincode: item.pincode || '226001',
          course: item.course || 'B.Tech CS',
          department: item.department || 'Science',
          semester: parseInt(item.semester || '1', 10),
          year: parseInt(item.year || '1', 10),
          rollNumber: item.rollNumber,
          batch: item.batch || '2025-2029',
          cardStatus: 'ISSUED',
          cardIssuedAt,
          cardExpiresAt,
          qrCodeData: barcode,
          walletBalance: 0.0,
          isActive: true
        }
      });

      // Dispatch welcome background email
      sendWelcomeEmail({
        email: item.email,
        fullName: item.fullName,
        studentId,
        rollNumber: item.rollNumber
      }).catch(err => {});

      successCount++;
    } catch (csvError: any) {
      failureCount++;
      errorsReport.push({ line: i + 1, error: csvError.message });
    }
  }

  // Cleanup uploaded file securely
  try {
    require('fs').unlinkSync(req.file.path);
  } catch (err) {}

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_BULK_IMPORT',
      `Imported student batch CSV. Successful records: ${successCount}, failed: ${failureCount}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'CSV bulk migration script processed successfully.',
    data: {
      inserted: successCount,
      discarded: failureCount,
      failures: errorsReport
    }
  });
});

/**
 * 10. exportStudents
 * Builds and streams raw Excel-compatible tabular CSV text.
 */
export const exportStudents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const students = await prisma.student.findMany({
    where: { isActive: true },
    select: {
      studentId: true,
      fullName: true,
      email: true,
      phone: true,
      rollNumber: true,
      course: true,
      semester: true,
      cardStatus: true,
      createdAt: true
    }
  });

  const headers = ['Student ID', 'Full Name', 'Email', 'Phone', 'Roll Number', 'Course', 'Semester', 'Card Status', 'Created At'];
  const csvRows = [headers.join(',')];

  students.forEach((std) => {
    const row = [
      `"${std.studentId}"`,
      `"${std.fullName.replace(/"/g, '""')}"`,
      `"${std.email}"`,
      `"${std.phone}"`,
      `"${std.rollNumber}"`,
      `"${std.course}"`,
      std.semester,
      `"${std.cardStatus}"`,
      `"${std.createdAt.toISOString()}"`
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="campuspass_students_ledger.csv"');
  res.status(200).send(csvContent);
});

/**
 * 11. bulkAction
 * Applies state shifts, notifications or promotions across multiple student ID streams.
 */
export const bulkAction = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { studentIds, action, extraPayload } = req.body;

  if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
    throw new AppError('Provide a valid non-empty array of target Student database IDs.', 400);
  }

  if (!action) {
    throw new AppError('State administrative action parameter must be explicitly defined.', 400);
  }

  let successCount = 0;

  if (action === 'BLOCK') {
    const result = await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { cardStatus: 'SUSPENDED', cardVersion: { increment: 1 } }
    });
    successCount = result.count;
  } else if (action === 'UNBLOCK') {
    const result = await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { cardStatus: 'ISSUED', cardVersion: { increment: 1 } }
    });
    successCount = result.count;
  } else if (action === 'PROMOTE') {
    // Increment semester for selected targets
    const result = await prisma.student.updateMany({
      where: { id: { in: studentIds }, semester: { lt: 8 } },
      data: { semester: { increment: 1 } }
    });
    successCount = result.count;
  } else if (action === 'NOTIFY') {
    if (!extraPayload || !extraPayload.title || !extraPayload.message) {
      throw new AppError('Providing notification title & message is required for bulk broadcasts.', 400);
    }
    
    // Create notifications in database
    const notificationInserts = studentIds.map((id) => prisma.notification.create({
      data: {
        studentId: id,
        title: extraPayload.title,
        message: extraPayload.message
      }
    }));
    await Promise.all(notificationInserts);
    successCount = studentIds.length;
  } else {
    throw new AppError(`Action type '${action}' not supported inside administrative bulk manager.`, 400);
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'STUDENT_BULK_ACTION',
      `Applied bulk ${action} across ${successCount} student profiles.`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Bulk operation processed. Applied administrative ${action} action across ${successCount} target student profiles.`
  });
});
