import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { decryptQRData } from '../utils/encryption';
import { sendEmail } from '../utils/email';
import { logAdminActivity } from '../middleware/audit';

/**
 * ============================================================================
 * STUDENT ATTENDANCE CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. markAttendance (Student QR Scan)
 * Student scans lecturer terminal QR, or terminal scans student phone QR code.
 */
export const markAttendance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  const studentIdVal = req.user?.studentId;

  const { qrString, location, deviceId } = req.body;

  if (!qrString) {
    throw new AppError('Provide secure QR code ticket data.', 400);
  }

  try {
    // Basic decrypt and validation
    const rawData = decryptQRData(qrString);
    const payload = JSON.parse(rawData);

    // If student scanned lecturer token containing class id:
    const classId = payload.classId || 'DEFAULT_CLASS';
    const creatorId = payload.creatorId || 'SYSTEM';

    // Verify time window freshness (QR code only stays active for 5 minutes)
    if (payload.timestamp && Date.now() - payload.timestamp > 300000) {
      throw new AppError('This attendance session has expired.', 400);
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Assert same day unique entries matching subject classes
    const existingCheckIn = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: { gte: todayStart, lte: todayEnd },
        location: classId
      }
    });

    if (existingCheckIn) {
      throw new AppError('Your attendance has already been recorded for this class session today.', 400);
    }

    const attendanceRecord = await prisma.attendance.create({
      data: {
        studentId: studentId!,
        date: new Date(),
        status: 'PRESENT',
        checkedInAt: new Date(),
        method: 'QR_SCAN',
        location: classId,
        verifiedByAdmin: creatorId
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Classroom attendance logged successfully.',
      data: { attendance: attendanceRecord }
    });
  } catch (error: any) {
    throw new AppError(`Scanning failed: ${error.message || 'Malformed secure QR token structure'}`, 400);
  }
});

/**
 * 2. markAttendanceNFC (NFC Smart Card Simulation)
 * Simulates physical digital card swipe or DeX emulator tap on NFC gates.
 */
export const markAttendanceNFC = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { cardSerialCode, gateDeviceId, location } = req.body;

  if (!cardSerialCode) {
    throw new AppError('NFC physical scanner must transmit Card serial code reference.', 400);
  }

  // Lookup student by barcode or serial number
  const student = await prisma.student.findFirst({
    where: { studentId: cardSerialCode }
  });

  if (!student) {
    throw new AppError('Security Alarm. NFC credential swipe unrecognized.', 404);
  }

  if (!student.isActive) {
    throw new AppError('Security Alarm. Swiped card profile represents suspended user.', 403);
  }

  if (student.cardStatus === 'SUSPENDED') {
    throw new AppError('Gate Denied. Swiped dynamic credential state represents BLOCKED card.', 403);
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Search if checking in or checking out
  const existingToday = await prisma.attendance.findFirst({
    where: {
      studentId: student.id,
      date: { gte: todayStart, lte: todayEnd },
      method: 'BIOMETRIC' // NFC gates use BIOMETRIC/NFC schema
    }
  });

  let message = '';
  let updatedRecord;

  if (!existingToday) {
    // Record primary Check In
    updatedRecord = await prisma.attendance.create({
      data: {
        studentId: student.id,
        date: new Date(),
        status: 'PRESENT',
        checkedInAt: new Date(),
        method: 'BIOMETRIC',
        location: location || 'Main Entrance Gate 1',
        verifiedByAdmin: 'AUTOMATED_RFID_READER'
      }
    });
    message = `Check-In successful. Welcome ${student.fullName}!`;
  } else {
    // Record Check Out
    updatedRecord = await prisma.attendance.update({
      where: { id: existingToday.id },
      data: {
        checkedOutAt: new Date()
      }
    });
    message = `Check-Out successful. Goodbye ${student.fullName}!`;
  }

  res.status(200).json({
    status: 'success',
    message,
    data: { attendance: updatedRecord }
  });
});

/**
 * 3. getMyAttendance (Student)
 * Returns individual attendance sheets and metrics.
 */
export const getMyAttendance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Session validation mismatched.', 401);
  }

  const entries = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: 'desc' }
  });

  const presentCount = entries.filter(e => e.status === 'PRESENT').length;
  const percentage = entries.length > 0 ? parseFloat(((presentCount / entries.length) * 100).toFixed(2)) : 100.00;

  res.status(200).json({
    status: 'success',
    data: {
      entries,
      metrics: {
        totalClassesScheduled: entries.length,
        totalClassesAttended: presentCount,
        overallPercentage: percentage
      }
    }
  });
});

/**
 * ============================================================================
 * ADMIN ATTENDANCE CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getTodayAttendance (Admin)
 * Aggregate present rates.
 */
export const getTodayAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Present metrics
  const activeStudentsCount = await prisma.student.count({ where: { isActive: true } });

  const totalPresentToday = await prisma.attendance.count({
    where: {
      status: 'PRESENT',
      date: { gte: todayStart, lte: todayEnd }
    }
  });

  const attendanceRate = activeStudentsCount > 0 
    ? parseFloat(((totalPresentToday / activeStudentsCount) * 100).toFixed(2)) 
    : 100.00;

  res.status(200).json({
    status: 'success',
    data: {
      activeStudents: activeStudentsCount,
      presentTally: totalPresentToday,
      percentageRate: attendanceRate
    }
  });
});

/**
 * 2. getAllAttendance (Admin)
 */
export const getAllAttendance = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '20', 10);
  const skip = (page - 1) * limit;

  const { status, method, startDate, endDate, rollNumber } = req.query;

  const whereClause: any = {};

  if (status) {
    whereClause.status = status.toString();
  }
  if (method) {
    whereClause.method = method.toString() as any;
  }
  if (startDate || endDate) {
    whereClause.date = {};
    if (startDate) {
      whereClause.date.gte = new Date(startDate.toString());
    }
    if (endDate) {
      whereClause.date.lte = new Date(endDate.toString());
    }
  }
  if (rollNumber) {
    whereClause.student = { rollNumber: rollNumber.toString() };
  }

  const [records, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: { select: { fullName: true, studentId: true, rollNumber: true, course: true } }
      },
      orderBy: { date: 'desc' },
      skip,
      take: limit
    }),
    prisma.attendance.count({ where: whereClause })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      attendance: records,
      pagination: {
        page,
        limit,
        totalEntries: count,
        totalPages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * 3. updateAttendance (Admin Override)
 * Explicit updates of attendance flags with documentation cause parameters.
 */
export const updateAttendance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  if (!status || !reason) {
    throw new AppError('Provide status update (PRESENT / ABSENT) and justification notes.', 400);
  }

  const attendance = await prisma.attendance.findUnique({
    where: { id },
    include: { student: true }
  });

  if (!attendance) {
    throw new AppError('Attendance sheet entry not found.', 404);
  }

  const updated = await prisma.attendance.update({
    where: { id },
    data: {
      status,
      verifiedByAdmin: req.user?.email || 'ADMIN'
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ATTENDANCE_OVERRIDE',
      `Modified record of ${attendance.student.fullName} on ${attendance.date.toDateString()} to ${status}. Details: ${reason}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Attendance entry modified successfully page override.',
    data: { attendance: updated }
  });
});

/**
 * 4. bulkMarkAttendance (Admin)
 * Force flags lists.
 */
export const bulkMarkAttendance = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { studentIds, status, location } = req.body;

  if (!studentIds || !Array.isArray(studentIds) || !status) {
    throw new AppError('Supply list of student database IDs and target status.', 400);
  }

  const inserts = studentIds.map((id) => prisma.attendance.create({
    data: {
      studentId: id,
      date: new Date(),
      status,
      method: 'MANUAL',
      location: location || 'Registry Class Roll Call',
      verifiedByAdmin: req.user?.email || 'ADMIN'
    }
  }));

  await prisma.$transaction(inserts);

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ATTENDANCE_BULK_MARK',
      `Manual catalog logging applied. Marked ${studentIds.length} student files as: ${status}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Batch complete. Successfully logged ${studentIds.length} students as ${status}.`
  });
});

/**
 * 5. generateAttendanceReport (Admin)
 * Aggregate department attendance statistics.
 */
export const generateAttendanceReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const aggregation = await prisma.attendance.groupBy({
    by: ['status', 'method'],
    _count: { id: true }
  });

  res.status(200).json({
    status: 'success',
    data: { breakdown: aggregation }
  });
});

/**
 * 6. sendLowAttendanceWarning (Admin)
 */
export const sendLowAttendanceWarning = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { minimumThreshold } = req.body;
  const threshold = parseFloat(minimumThreshold || '75.0');

  const students = await prisma.student.findMany({
    where: { isActive: true },
    include: { attendance: true }
  });

  let alertSentCount = 0;

  for (const std of students) {
    const presentCount = std.attendance.filter(a => a.status === 'PRESENT').length;
    const totalCount = std.attendance.length;

    if (totalCount > 4) { // Only warns if they had a minimum of 4 lessons scheduled
      const rate = parseFloat(((presentCount / totalCount) * 100).toFixed(2));

      if (rate < threshold) {
        alertSentCount++;
        // Speed dispatch warning email
        sendEmail(
          std.email,
          'URGENT: Low Attendance Warning Notice',
          `<h2>Low Attendance Alert</h2><p>Dear ${std.fullName},</p><p>Your attendance rate has fallen below the mandated threshold of <strong>${threshold}%</strong>. Your current checked attendance rate stands at: <span style="color:#e53e3e; font-weight:bold;">${rate}%</span>.</p><p>Please note that falling below 75% attendance disqualifies candidates from sitting exam terms. Meet with core counselors immediately.</p>`
        ).catch(err => {});
      }
    }
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ATTENDANCE_LOW_WARNINGS_DISPATCHED',
      `Automated low attendance warning emails delivered to ${alertSentCount} active students below ${threshold}%`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Verification complete. Low attendance alert warnings delivered to ${alertSentCount} students.`
  });
});
