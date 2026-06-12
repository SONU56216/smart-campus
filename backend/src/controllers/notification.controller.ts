import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { sendEmail } from '../utils/email';
import { logAdminActivity } from '../middleware/audit';

/**
 * 1. sendToStudent (Admin)
 */
export const sendToStudent = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { studentId, title, message, alsoSendEmail } = req.body;

  if (!studentId || !title || !message) {
    throw new AppError('Provide target student ID, notification title and message body.', 400);
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId }
  });

  if (!student) {
    throw new AppError('Student profile record missing.', 404);
  }

  const notice = await prisma.notification.create({
    data: {
      studentId,
      title,
      message,
      isRead: false
    }
  });

  if (alsoSendEmail) {
    sendEmail(
      student.email,
      title,
      `<h2>${title}</h2><p>Dear ${student.fullName},</p><p>${message}</p>`
    ).catch(err => {});
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'NOTIFICATION_SENT_SINGLE',
      `Sent custom in-app notice to student: ${student.fullName} (${student.studentId})`,
      req
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Targeted student notification delivered.',
    data: { notification: notice }
  });
});

/**
 * 2. sendToAll (Admin)
 * Creates a global announcement (studentId is null)
 */
export const sendToAll = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { title, message } = req.body;

  if (!title || !message) {
    throw new AppError('Specify announcement title and details.', 400);
  }

  const notice = await prisma.notification.create({
    data: {
      studentId: null, // Null value flags system broadcast
      title,
      message,
      isRead: false
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'NOTIFICATION_BROADCAST_GLOBAL',
      `Fired system-wide global campus announcement: ${title}`,
      req
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Global announcement fired successfully.',
    data: { notification: notice }
  });
});

/**
 * 3. sendToGroup (Admin)
 * Filters cohorts (e.g. course, semester) and instantiates multiple target blocks inside transaction limits.
 */
export const sendToGroup = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { course, semester, title, message } = req.body;

  if (!title || !message) {
    throw new AppError('Notification header and details are mandatory.', 400);
  }

  const filter: any = { isActive: true };
  if (course) {
    filter.course = course;
  }
  if (semester) {
    filter.semester = parseInt(semester.toString(), 10);
  }

  const students = await prisma.student.findMany({
    where: filter,
    select: { id: true, email: true }
  });

  if (students.length === 0) {
    throw new AppError('No active student cohorts match this combination criteria.', 400);
  }

  const notifications = students.map((std) => prisma.notification.create({
    data: {
      studentId: std.id,
      title,
      message,
      isRead: false
    }
  }));

  await prisma.$transaction(notifications);

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'NOTIFICATION_SENT_COHORT',
      `Dispatched dynamic alert alerts to student cohort (${course || 'All'} / Sem ${semester || 'All'}). Count: ${students.length}`,
      req
    );
  }

  res.status(201).json({
    status: 'success',
    message: `Notifications successfully queued for dispatch across ${students.length} target profiles.`
  });
});

/**
 * 4. getNotificationHistory (Admin)
 */
export const getNotificationHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const list = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { student: { select: { fullName: true, studentId: true } } }
  });

  res.status(200).json({
    status: 'success',
    data: { notificationHistory: list }
  });
});

/**
 * 5. deleteNotification (Admin)
 */
export const deleteNotification = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const exists = await prisma.notification.findUnique({
    where: { id }
  });

  if (!exists) {
    throw new AppError('Target notice could not be found.', 404);
  }

  await prisma.notification.delete({
    where: { id }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'NOTIFICATION_REMOVED',
      `Purged notification ID ${id} containing heading "${exists.title}"`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Notification node purged from database registers.'
  });
});
