import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { applicationSchema } from '../utils/validators';
import { generateAdmissionLetter } from '../utils/pdfGenerator';
import { generateApplicationNumber, generateTransactionId } from '../utils/generateId';
import { sendApplicationApproved, sendEmail } from '../utils/email';
import { logAdminActivity } from '../middleware/audit';

/**
 * ============================================================================
 * STUDENT ADMISSION CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. submitApplication (Student)
 * Submits a validated multi-step admission application. Links back to the Student profile if signed in.
 */
export const submitApplication = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id || null;
  const validatedData = await applicationSchema.parseAsync(req.body);

  // Check if student or email already submitted an application
  const existingApp = await prisma.admissionApplication.findFirst({
    where: {
      OR: [
        { email: validatedData.email },
        ...(studentId ? [{ studentId }] : [])
      ]
    }
  });

  if (existingApp) {
    throw new AppError('An admission application has already been registered with this email or profile.', 400);
  }

  const applicationNumber = generateApplicationNumber();

  const newApp = await prisma.admissionApplication.create({
    data: {
      ...validatedData,
      applicationNumber,
      studentId,
      status: 'SUBMITTED',
      paymentStatus: 'PENDING',
      feePaid: 500.0 // Application fee default
    }
  });

  // Create an ActivityLog entry for tracking if student is signed in
  if (studentId) {
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;
    await prisma.activityLog.create({
      data: {
        studentId,
        action: 'ADMISSION_SUBMITTED',
        description: `Admission application registered. Ref: ${applicationNumber}`,
        ipAddress
      }
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'Your admission application has been registered successfully.',
    data: {
      application: {
        id: newApp.id,
        applicationNumber: newApp.applicationNumber,
        fullName: newApp.fullName,
        course: newApp.course,
        status: newApp.status,
        paymentStatus: newApp.paymentStatus
      }
    }
  });
});

/**
 * 2. getMyApplications (Student)
 * Returns all admission application forms submitted under the student's active credentials.
 */
export const getMyApplications = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const studentId = req.user?.id;
  const studentEmail = req.user?.email;

  if (!studentId) {
    throw new AppError('Session validation mismatched.', 401);
  }

  const applications = await prisma.admissionApplication.findMany({
    where: {
      OR: [
        { studentId },
        { email: studentEmail }
      ]
    },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { applications }
  });
});

/**
 * 3. getApplicationStatus (Student)
 * Returns status, transactional payments, and remarks of an admission application by ID.
 */
export const getApplicationStatus = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const studentId = req.user?.id;
  const studentEmail = req.user?.email;

  const app = await prisma.admissionApplication.findUnique({
    where: { id },
    include: { payments: true }
  });

  if (!app) {
    throw new AppError('The requested application record was not found.', 404);
  }

  // Authorisation boundary: only student owner or administrator should read this target node
  if (studentId && app.studentId !== studentId && app.email !== studentEmail) {
    throw new AppError('Access Denied. You do not own this application record.', 403);
  }

  res.status(200).json({
    status: 'success',
    data: { application: app }
  });
});

/**
 * 4. updateApplication (Student)
 * Allows candidate updates to application data such as contact numbers or address before final submission approvals.
 */
export const updateApplication = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  const app = await prisma.admissionApplication.findUnique({
    where: { id }
  });

  if (!app) {
    throw new AppError('Application record not found.', 404);
  }

  if (studentId && app.studentId !== studentId) {
    throw new AppError('You do not have administrative authorization to modify this application draft.', 403);
  }

  if (app.status !== 'SUBMITTED' && app.status !== 'UNDER_REVIEW') {
    throw new AppError(`Cannot update application at its current processing stage: ${app.status}`, 400);
  }

  // Only allow updating demographics and marks
  const updates = { ...req.body };
  delete updates.id;
  delete updates.status;
  delete updates.applicationNumber;
  delete updates.paymentStatus;
  delete updates.feePaid;

  const updatedApp = await prisma.admissionApplication.update({
    where: { id },
    data: updates
  });

  res.status(200).json({
    status: 'success',
    message: 'Application details updated successfully.',
    data: { application: updatedApp }
  });
});

/**
 * 5. payApplicationFee (Student)
 * Records simulation of high-availability gateway fee payments for an admission form.
 */
export const payApplicationFee = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { paymentGateway } = req.body;

  if (!paymentGateway) {
    throw new AppError('Specify the desired payment gateway pathway.', 400);
  }

  const app = await prisma.admissionApplication.findUnique({
    where: { id }
  });

  if (!app) {
    throw new AppError('Target application record missing.', 404);
  }

  if (app.paymentStatus === 'SUCCESS') {
    throw new AppError('Registration fee has already been paid for this application.', 400);
  }

  const transactionId = generateTransactionId();

  // Commit application payment on relational ledger transaction
  const [updatedApp, payment] = await prisma.$transaction([
    prisma.admissionApplication.update({
      where: { id },
      data: { paymentStatus: 'SUCCESS' }
    }),
    prisma.payment.create({
      data: {
        transactionId,
        studentId: app.studentId,
        admissionApplicationId: app.id,
        amount: app.feePaid,
        purpose: 'ADMISSION_APPLICATION_FEE',
        status: 'SUCCESS',
        paymentGateway
      }
    })
  ]);

  res.status(200).json({
    status: 'success',
    message: 'Registration application fee payment received successfully.',
    data: {
      paymentStatus: updatedApp.paymentStatus,
      transaction: payment
    }
  });
});

/**
 * 6. downloadAdmissionLetter (Student)
 * Builds and streams custom styled PDF provisional offer of admission directly to client browser.
 */
export const downloadAdmissionLetter = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const studentId = req.user?.id;

  const app = await prisma.admissionApplication.findUnique({
    where: { id }
  });

  if (!app) {
    throw new AppError('Application record not found.', 404);
  }

  if (studentId && app.studentId !== studentId && app.email !== req.user?.email) {
    throw new AppError('Forbidden. You do not own this application record.', 403);
  }

  if (app.status !== 'APPROVED') {
    throw new AppError(`Admission letter only generated for APPROVED applications. Current Status: ${app.status}`, 400);
  }

  const pdfBuffer = await generateAdmissionLetter({
    applicationNumber: app.applicationNumber,
    fullName: app.fullName,
    address: `${app.address}, ${app.city}, ${app.state} - ${app.pincode}`,
    course: app.course,
    department: app.department,
    fee: 10000.0, // Standard admission fee amount configuration fallback
    academicYear: '2025-2026'
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="provisional_admission_offer_${app.applicationNumber}.pdf"`);
  res.status(200).send(pdfBuffer);
});

/**
 * ============================================================================
 * ADMIN ADMISSION CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getAllApplications (Admin)
 * Retrieve paginated admission registers matching status or department streams.
 */
export const getAllApplications = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string || '1', 10);
  const limit = parseInt(req.query.limit as string || '10', 10);
  const skip = (page - 1) * limit;

  const { status, course, department, search } = req.query;

  const filter: any = {};
  if (status) {
    filter.status = status.toString() as any;
  }
  if (course) {
    filter.course = course.toString();
  }
  if (department) {
    filter.department = department.toString();
  }
  if (search) {
    const srchStr = search.toString();
    filter.OR = [
      { fullName: { contains: srchStr, mode: 'insensitive' } },
      { email: { contains: srchStr, mode: 'insensitive' } },
      { phone: { contains: srchStr, mode: 'insensitive' } },
      { applicationNumber: { contains: srchStr, mode: 'insensitive' } }
    ];
  }

  const [applications, totalEntries] = await prisma.$transaction([
    prisma.admissionApplication.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: { student: { select: { studentId: true, rollNumber: true } } }
    }),
    prisma.admissionApplication.count({ where: filter })
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      applications,
      pagination: {
        page,
        limit,
        totalEntries,
        totalPages: Math.ceil(totalEntries / limit)
      }
    }
  });
});

/**
 * 2. getApplicationById (Admin)
 * Detail view of application and related payloads.
 */
export const getApplicationById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const app = await prisma.admissionApplication.findUnique({
    where: { id },
    include: {
      student: true,
      payments: true
    }
  });

  if (!app) {
    throw new AppError('The requested admission application does not exist.', 404);
  }

  res.status(200).json({
    status: 'success',
    data: { application: app }
  });
});

/**
 * 3. approveApplication (Admin)
 * Change status to APPROVED and sends congratulatory emails triggered in backgrounds.
 */
export const approveApplication = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { remarks } = req.body;

  const app = await prisma.admissionApplication.findUnique({
    where: { id }
  });

  if (!app) {
    throw new AppError('Application record not found.', 404);
  }

  if (app.status === 'APPROVED') {
    throw new AppError('This registration application has already been approved.', 400);
  }

  const updatedApp = await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: 'APPROVED',
      remarks: remarks || 'Documents approved during administrative verification.'
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMISSION_APPROVED',
      `Approved registration reference ID ${app.applicationNumber} of candidate ${app.fullName}`,
      req
    );
  }

  // Speed-dispatch candidate approval mail notifications
  sendApplicationApproved({ email: app.email, fullName: app.fullName }, app.applicationNumber, app.course)
    .catch(err => console.error('Admission candidate email dispatch failure:', err));

  res.status(200).json({
    status: 'success',
    message: `Application reference ${app.applicationNumber} has been approved successfully.`,
    data: { application: updatedApp }
  });
});

/**
 * 4. rejectApplication (Admin)
 * Set state of registration request to REJECTED.
 */
export const rejectApplication = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { remarks } = req.body;

  if (!remarks) {
    throw new AppError('Provide administrative remarks describing the cause for candidate rejection.', 400);
  }

  const app = await prisma.admissionApplication.findUnique({
    where: { id }
  });

  if (!app) {
    throw new AppError('Application record not found.', 404);
  }

  const updatedApp = await prisma.admissionApplication.update({
    where: { id },
    data: {
      status: 'REJECTED',
      remarks
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMISSION_REJECTED',
      `Rejected registration request ${app.applicationNumber} of ${app.fullName}. Reason: ${remarks}`,
      req
    );
  }

  // Dispatch rejection notification mail
  sendEmail(
    app.email,
    'Admission Application Status Update',
    `<h2>Admission Application Rejected</h2><p>Dear ${app.fullName},</p><p>We regret to inform you that your provisional registration form (${app.applicationNumber}) has been rejected for the following reason:</p><p style="color:#e53e3e; font-weight:bold;">${remarks}</p><p>You can re-verify and update documents via the digital portal if required.</p>`
  ).catch(err => {});

  res.status(200).json({
    status: 'success',
    message: 'Application rejected and warning details delivered.',
    data: { application: updatedApp }
  });
});

/**
 * 5. bulkApproveApplications (Admin)
 * Process transactional set approvals.
 */
export const bulkApproveApplications = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { ids, remarks } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Supply a non-empty array of Admission Application database IDs.', 400);
  }

  const updated = await prisma.admissionApplication.updateMany({
    where: { id: { in: ids }, status: { not: 'APPROVED' } },
    data: {
      status: 'APPROVED',
      remarks: remarks || 'Batch approved by admissions department.'
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMISSION_BULK_APPROVED',
      `Batch approved ${updated.count} candidate application files.`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: `Batch complete. Successfully approved ${updated.count} candidate registration profiles.`
  });
});

/**
 * 6. sendOfferLetters (Admin)
 * Emails offer letters to selected applications
 */
export const sendOfferLetters = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Include a non-empty array of approved admission application IDs.', 400);
  }

  const approvedApps = await prisma.admissionApplication.findMany({
    where: { id: { in: ids }, status: 'APPROVED' }
  });

  for (const app of approvedApps) {
    sendEmail(
      app.email,
      'OFFICIAL ENROLLMENT OFFER LETTER',
      `
      <h3>Dear ${app.fullName},</h3>
      <p>Your provisional enrollment offer letter for course <strong>${app.course}</strong> is ready for review.</p>
      <p>Log in to the CampusPass app using your credentials, download the formal certified admissions PDF letter, and finalise physical documentation reviews.</p>
      `
    ).catch(err => console.error('Dispatch letter failure:', err));
  }

  res.status(200).json({
    status: 'success',
    message: `Offer message dispatches scheduled for ${approvedApps.length} approved applicants.`
  });
});

/**
 * 7. generateMeritList (Admin)
 * Generates an automated ranking list by calculation of intermediate percentage weights.
 */
export const generateMeritList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { course } = req.query;

  if (!course) {
    throw new AppError('Select target course name to compute merit hierarchy.', 400);
  }

  const candidates = await prisma.admissionApplication.findMany({
    where: {
      course: course.toString()
    },
    orderBy: [
      { intermediateMarks: 'desc' },
      { highSchoolMarks: 'desc' }
    ],
    select: {
      applicationNumber: true,
      fullName: true,
      course: true,
      highSchoolMarks: true,
      intermediateMarks: true,
      status: true
    }
  });

  const rankedList = candidates.map((candidate, index) => ({
    rank: index + 1,
    score: parseFloat(((candidate.intermediateMarks * 0.6) + (candidate.highSchoolMarks * 0.4)).toFixed(2)), // composite 60-40 rule weightings
    ...candidate
  }));

  res.status(200).json({
    status: 'success',
    courseRequested: course.toString(),
    count: rankedList.length,
    data: { meritList: rankedList }
  });
});

/**
 * ============================================================================
 * PUBLIC ADMISSION CONTROLLER METHODS
 * ============================================================================
 */

/**
 * 1. getMeritList (Public)
 * Open search to view merit listings course-by-course without authentication.
 */
export const getMeritList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { course } = req.query;

  if (!course) {
    throw new AppError('Include the course parameter to check active rankings.', 400);
  }

  const meritCandidates = await prisma.admissionApplication.findMany({
    where: {
      course: course.toString(),
      status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED'] }
    },
    orderBy: [
      { intermediateMarks: 'desc' },
      { highSchoolMarks: 'desc' }
    ],
    select: {
      applicationNumber: true,
      fullName: true,
      course: true,
      intermediateMarks: true,
      status: true
    }
  });

  const scores = meritCandidates.map((c, i) => ({
    rank: i + 1,
    applicationNumber: c.applicationNumber,
    // obfuscate candidate details slightly for public viewer anonymity
    fullName: c.fullName.replace(/(?<=.).(?=.)/g, '*'),
    intermediateMarks: c.intermediateMarks,
    status: c.status
  }));

  res.status(200).json({
    status: 'success',
    data: { meritList: scores }
  });
});
