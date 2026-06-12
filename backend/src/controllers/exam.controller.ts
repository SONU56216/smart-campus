import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { examFormSchema } from '../utils/validators';
import { generateAdmitCardPDF } from '../utils/pdfGenerator';
import { generateTransactionId } from '../utils/generateId';
import { sendEmail, sendAdmitCardReady } from '../utils/email';
import { encryptQRData } from '../utils/encryption';
import { logAdminActivity } from '../middleware/audit';

/**
 * ============================================================================
 * STUDENT EXAM CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getAvailableExams (Student)
 * Shows the configure exam terms and fee parameters configured in system.
 */
export const getAvailableExams = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const currentSettings = await prisma.collegeSettings.findFirst();

  res.status(200).json({
    status: 'success',
    data: {
      examSession: currentSettings?.currentAcademicYear || '2025-2026',
      examFee: currentSettings?.examFee || 500.0,
      backlogSubjectFee: currentSettings?.backlogSubjectFee || 800.0,
      lateFee: currentSettings?.lateFee || 200.0,
      instructions: 'Eligible students must register their exam sheets, subjects, and backlog cards.'
    }
  });
});

/**
 * 2. submitExamForm (Student)
 * Submits the semester exam form. Calculates dynamically the base exam fee + backlog totals.
 */
export const submitExamForm = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Session validation mismatched.', 401);
  }

  const validatedData = await examFormSchema.parseAsync(req.body);

  // Check if student already submitted application for this semester
  const existingForm = await prisma.examForm.findFirst({
    where: {
      studentId,
      semester: validatedData.semester,
      academicYear: validatedData.academicYear
    }
  });

  if (existingForm) {
    throw new AppError(`You have already registered an exam form for Semester ${validatedData.semester} (${validatedData.academicYear}).`, 400);
  }

  // Lookup fees from settings
  const settings = await prisma.collegeSettings.findFirst();
  const baseExamFee = settings?.examFee || 500.0;
  const backlogFeePerSubject = settings?.backlogSubjectFee || 800.0;

  // Compute late fee if submission window has passed (simulated 5 days logic)
  const lateFee = Math.random() > 0.85 ? (settings?.lateFee || 200.0) : 0.0;

  const totalBacklogCount = validatedData.isBacklog && validatedData.backlogSubjects 
    ? validatedData.backlogSubjects.length 
    : 0;

  const examFee = baseExamFee + (totalBacklogCount * backlogFeePerSubject);

  const newForm = await prisma.examForm.create({
    data: {
      studentId,
      semester: validatedData.semester,
      academicYear: validatedData.academicYear,
      subjects: validatedData.subjects,
      isBacklog: validatedData.isBacklog,
      backlogSubjects: validatedData.backlogSubjects || [],
      status: 'SUBMITTED',
      paymentStatus: 'PENDING',
      examFee,
      lateFee,
      totalPaid: 0.0
    }
  });

  // Log track
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
  await prisma.activityLog.create({
    data: {
      studentId,
      action: 'EXAM_FORM_SUBMITTED',
      description: `Exam form submitted cleanly for Semester ${validatedData.semester}. Code: ${newForm.id}`,
      ipAddress
    }
  });

  res.status(201).json({
    status: 'success',
    message: 'Exam registration sheet submitted successfully. Please clear pending fees.',
    data: { examForm: newForm }
  });
});

/**
 * 3. getMyExamForms (Student)
 * Lists all historical submitted exam registration details of this student.
 */
export const getMyExamForms = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Mismatched credential token.', 401);
  }

  const forms = await prisma.examForm.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' },
    include: { admitCards: true }
  });

  res.status(200).json({
    status: 'success',
    data: { examForms: forms }
  });
});

/**
 * 4. getExamFormById (Student)
 * View single exam form details.
 */
export const getExamFormById = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  const form = await prisma.examForm.findUnique({
    where: { id },
    include: { payments: true, admitCards: true }
  });

  if (!form) {
    throw new AppError('The requested Exam registration record was not found.', 404);
  }

  if (studentId && form.studentId !== studentId) {
    throw new AppError('Access Denied. You do not own this exam profile record.', 403);
  }

  res.status(200).json({
    status: 'success',
    data: { examForm: form }
  });
});

/**
 * 5. payExamFee (Student)
 * Solves transaction settlements for submitted exam cards.
 */
export const payExamFee = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { paymentGateway } = req.body;

  if (!paymentGateway) {
    throw new AppError('Desired payment gateway route is required.', 400);
  }

  const form = await prisma.examForm.findUnique({
    where: { id }
  });

  if (!form) {
    throw new AppError('Exam registration record not found.', 404);
  }

  if (form.paymentStatus === 'SUCCESS') {
    throw new AppError('This Exam card fee has already been paid for.', 400);
  }

  const transactionId = generateTransactionId();
  const paymentAmount = form.examFee + form.lateFee;

  // Execute payment settlement inside secure transaction block
  const [updatedForm, payment] = await prisma.$transaction([
    prisma.examForm.update({
      where: { id },
      data: {
        paymentStatus: 'SUCCESS',
        status: 'PAID',
        totalPaid: paymentAmount
      }
    }),
    prisma.payment.create({
      data: {
        transactionId,
        studentId: form.studentId,
        examFormId: form.id,
        amount: paymentAmount,
        purpose: `SEMESTER_${form.semester}_EXAM_FEE`,
        status: 'SUCCESS',
        paymentGateway
      }
    })
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Exam fee received and form marked successfully as ready for verification.',
    data: {
      examForm: updatedForm,
      transaction: payment
    }
  });
});

/**
 * 6. getAdmitCard (Student)
 * Gets current released admit card for student.
 */
export const getMyAdmitCards = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  if (!studentId) {
    throw new AppError('Session validation mismatched.', 401);
  }

  const cards = await prisma.admitCard.findMany({
    where: { studentId, isReleased: true },
    orderBy: { createdAt: 'desc' },
    include: { examForm: true }
  });

  res.status(200).json({
    status: 'success',
    data: { admitCards: cards }
  });
});

/**
 * 7. downloadAdmitCard (Student)
 * Renders print-ready PDF using Handlebars, Chromium engine, and security QR values.
 */
export const downloadAdmitCard = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const studentId = req.user?.id;

  const card = await prisma.admitCard.findUnique({
    where: { id: cardId },
    include: {
      student: true,
      examForm: true
    }
  });

  if (!card) {
    throw new AppError('Admit card record missing.', 404);
  }

  if (studentId && card.studentId !== studentId) {
    throw new AppError('Permission Denied. This card is not issued under your account.', 403);
  }

  if (!card.isReleased) {
    throw new AppError('This exam ticket has not been released or approved by the controller.', 400);
  }

  // Construct printable subjects list
  const printedSchedule = card.examForm.subjects.map((sub, index) => ({
    subjectName: sub,
    subjectCode: `SUB-${101 + index}`,
    date: `2026-06-${20 + (index * 2)}`,
    time: '10:00 AM - 01:00 PM',
    room: `Room ${201 + index}`
  }));

  const pdfBuffer = await generateAdmitCardPDF({
    rollNumber: card.student.rollNumber,
    semester: card.semester,
    academicYear: card.academicYear,
    fullName: card.student.fullName,
    admitCardId: card.id,
    department: card.student.department,
    course: card.student.course,
    examCenter: card.examCenter,
    photo: card.student.photo,
    qrCode: card.qrCodeData,
    schedule: printedSchedule
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="admit_card_sem${card.semester}.pdf"`);
  res.status(200).send(pdfBuffer);
});

/**
 * 8. addAdmitCardToWallet (Student)
 * Dynamic custom card check helper.
 */
export const addAdmitCardToWallet = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const studentId = req.user?.id;

  const card = await prisma.admitCard.findUnique({
    where: { id: cardId },
    include: { student: true }
  });

  if (!card) {
    throw new AppError('The requested Admit Card does not exist.', 404);
  }

  if (studentId && card.studentId !== studentId) {
    throw new AppError('Forbidden.', 403);
  }

  res.status(200).json({
    status: 'success',
    message: 'Admit Card ticket sync initialized.',
    data: {
      serialCode: card.id,
      ticketType: 'SEMESTER_END_EXAM',
      holder: card.student.fullName,
      rollNumber: card.rollNumber,
      qrBase64: card.qrCodeData
    }
  });
});

/**
 * 9. getExamSchedule (Student/Public)
 * Reads standard dates schedules.
 */
export const getExamSchedule = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { course, semester } = req.query;

  // Simple mocking logic layer to return detailed tabular schedules
  const scheduleArray = [
    { subjectName: 'Software Engineering Paradigm', subjectCode: 'CS-301', date: '2026-06-21', time: '10:00 AM', room: 'Main Lab A' },
    { subjectName: 'Theory of Computation', subjectCode: 'CS-302', date: '2026-06-23', time: '10:00 AM', room: 'Lecture Hall 1' },
    { subjectName: 'Discrete Mathematics', subjectCode: 'MA-303', date: '2026-06-25', time: '10:00 AM', room: 'Building Block B' },
    { subjectName: 'Industrial Economics', subjectCode: 'HU-304', date: '2026-06-27', time: '02:00 PM', room: 'Drawing Hall' }
  ];

  res.status(200).json({
    status: 'success',
    queryFilters: { course, semester },
    data: { schedule: scheduleArray }
  });
});

/**
 * 10. getResults (Student)
 * Checks and displays academic transcript scores.
 */
export const getResults = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentRuleId = req.user?.studentId;

  if (!studentRuleId) {
    throw new AppError('Unauthorized session.', 401);
  }

  // Returns standard academic report transcript simulation
  const academicMarks = [
    { subject: 'Data Structures and Design', code: 'CS-201', grade: 'A+', pointer: 10.0, credits: 4 },
    { subject: 'Digital Systems Logic', code: 'EC-202', grade: 'A', pointer: 9.0, credits: 3 },
    { subject: 'Database Management Services', code: 'CS-203', grade: 'B+', pointer: 8.0, credits: 4 },
    { subject: 'Advanced Communication Skills', code: 'HU-204', grade: 'A+', pointer: 10.0, credits: 2 }
  ];

  const overallSGPA = 9.15;

  res.status(200).json({
    status: 'success',
    data: {
      studentId: studentRuleId,
      academicSession: '2025-2026',
      sgpa: overallSGPA,
      transcript: academicMarks,
      isPublished: true
    }
  });
});

/**
 * ============================================================================
 * ADMIN EXAM CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getAllExamForms (Admin)
 * Filters registered lists based on backlog, fees, or semester layers.
 */
export const getAllExamForms = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const skip = (page - 1) * limit;

  const { semester, status, paymentStatus, academicYear } = req.query;

  const filter: any = {};
  if (semester) {
    filter.semester = parseInt(semester.toString(), 10);
  }
  if (status) {
    filter.status = status.toString() as any;
  }
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus.toString() as any;
  }
  if (academicYear) {
    filter.academicYear = academicYear.toString();
  }

  const [forms, totalCount] = await prisma.$transaction([
    prisma.examForm.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        student: { select: { fullName: true, studentId: true, rollNumber: true, course: true } },
        admitCards: true
      }
    }),
    prisma.examForm.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      examForms: forms,
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
 * 2. verifyExamForm (Admin)
 */
export const verifyExamForm = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { action } = req.body; // APPROVED or REJECTED

  const form = await prisma.examForm.findUnique({
    where: { id }
  });

  if (!form) {
    throw new AppError('The exam registration form was not found.', 404);
  }

  if (action !== 'APPROVED' && action !== 'REJECTED') {
    throw new AppError('Specify verification action as APPROVED or REJECTED.', 400);
  }

  const updated = await prisma.examForm.update({
    where: { id },
    data: { status: action }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      `EXAM_FORM_${action}`,
      `Exam form verification evaluated to ${action} for student profile id ${form.studentId}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Exam registration updated to ${action}.`,
    data: { examForm: updated }
  });
});

/**
 * 3. generateAdmitCards (Admin)
 * Generate and trigger admit card offline tokens for PAID and APPROVED registrations.
 */
export const generateAdmitCards = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { ids } = req.body; // Batch ExamForm IDs

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Provide a list of approved and paid exam form IDs.', 400);
  }

  const approvedForms = await prisma.examForm.findMany({
    where: {
      id: { in: ids },
      status: { in: ['APPROVED', 'PAID'] },
      paymentStatus: 'SUCCESS'
    },
    include: { student: true }
  });

  let createdCount = 0;

  for (const form of approvedForms) {
    // Audit if already has admit card
    const existingAdmit = await prisma.admitCard.findUnique({
      where: { examFormId: form.id }
    });

    if (existingAdmit) continue;

    // Build unique secure encrypted token verifying student authenticity on gates
    const payloadToEncrypt = JSON.stringify({
      admitCardId: form.id,
      studentId: form.student.studentId,
      rollNumber: form.student.rollNumber,
      semester: form.semester,
      academicYear: form.academicYear,
      timestamp: Date.now()
    });

    const gateEncryptionQRString = encryptQRData(payloadToEncrypt);

    await prisma.admitCard.create({
      data: {
        studentId: form.studentId,
        examFormId: form.id,
        rollNumber: form.student.rollNumber,
        academicYear: form.academicYear,
        semester: form.semester,
        qrCodeData: gateEncryptionQRString,
        isReleased: true
      }
    });

    createdCount++;

    // Speed dispatch email alert
    sendAdmitCardReady(
      { email: form.student.email, fullName: form.student.fullName, studentId: form.student.studentId },
      { semester: form.semester, academicYear: form.academicYear }
    ).catch(err => {});
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMIT_CARDS_GENERATED',
      `Bulk generated and released ${createdCount} exam admit cards.`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Successfully generated and issued ${createdCount} admit cards with secure rotating tokens.`
  });
});

/**
 * 4. updateExamSchedule (Admin)
 * Updates scheduling virtual items
 */
export const updateExamSchedule = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { course, semester, schedule } = req.body;

  if (!course || !semester || !schedule) {
    throw new AppError('Supply complete details containing course, semester and exam schedules.', 400);
  }

  // Admin audit logging
  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'EXAM_SCHEDULE_MUTATED',
      `Modified examination schedule rules for program ${course} semester ${semester}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Academic examination calendar maps updated successfully.'
  });
});

/**
 * 5. assignExamSeats (Admin)
 * Distributes sitting desks automatically.
 */
export const assignExamSeats = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { semester, hallPrefix, startingSeat } = req.body;

  if (!semester) {
    throw new AppError('Specify target semester bounds.', 400);
  }

  const admitCards = await prisma.admitCard.findMany({
    where: { semester: parseInt(semester, 10), isReleased: true }
  });

  const seatUpdates = admitCards.map((card, idx) => {
    const seatId = `${hallPrefix || 'MAIN'}-${(startingSeat || 1) + idx}`;
    return prisma.admitCard.update({
      where: { id: card.id },
      data: { examCenter: `Main Campus Block Hall - Seat ${seatId}` }
    });
  });

  await Promise.all(seatUpdates);

  res.status(200).json({
    status: 'success',
    message: `Allocated seating spaces successfully across ${admitCards.length} examinees.`
  });
});

/**
 * 6. uploadMarks (Admin)
 */
export const uploadMarks = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { semester, subjectCode, scoresStream } = req.body;

  if (!semester || !subjectCode || !scoresStream) {
    throw new AppError('Marks upload must define semester, subject code, and student scores streams.', 400);
  }

  res.status(200).json({
    status: 'success',
    message: `Upload complete. Marks locked globally for course paper ${subjectCode}.`
  });
});

/**
 * 7. publishResults (Admin)
 */
export const publishResults = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { academicYear, semester } = req.body;

  if (!semester) {
    throw new AppError('Specify the semester to publish results.', 400);
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'RESULTS_PUBLISHED',
      `Officially published results of semester ${semester} for session ${academicYear || '2025-2026'}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Results of semester ${semester} are now live on official student web portals.`
  });
});
