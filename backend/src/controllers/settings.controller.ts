import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { settingsSchema } from '../utils/validators';
import { uploadToCloudinary } from '../utils/fileUpload';
import { logAdminActivity } from '../middleware/audit';

/**
 * 1. getSettings (Student/Public/Admin)
 * Fetches the system wide configurations. Initializes if table is empty.
 */
export const getSettings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let settings = await prisma.collegeSettings.findFirst();

  if (!settings) {
    // Auto-bootstrap defaults if empty so system runs error-free
    settings = await prisma.collegeSettings.create({
      data: {
        collegeName: 'CAMPUSPASS UNIVERSITY',
        shortName: 'CampusPass',
        address: 'Main Research Square, Tech City, PC 560001',
        email: 'info@campuspass.edu',
        phone: '+91 9876543210',
        website: 'https://campuspass.edu',
        logoUrl: 'https://cdn-icons-png.flaticon.com/512/5322/5322033.png',
        establishedYear: 1989,
        currentAcademicYear: '2025-2026',
        applicationFee: 500.0,
        admissionFee: 10000.0,
        semesterFee: 45000.0,
        examFee: 500.0,
        backlogSubjectFee: 800.0,
        lateFee: 200.0,
        hostelFee: 15000.0,
        messFee: 12000.0,
        busFee: 6000.0,
        cardValidityYears: 4,
        allowDigitalIDCheckout: true
      }
    });
  }

  res.status(200).json({
    status: 'success',
    data: { settings }
  });
});

/**
 * 2. updateSettings (Admin Only)
 * Allows updating institutional fees, academic sessions, and digital check rules.
 */
export const updateSettings = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const validatedData = await settingsSchema.parseAsync(req.body);

  let currentSettings = await prisma.collegeSettings.findFirst();

  let updatedSettings;

  if (currentSettings) {
    updatedSettings = await prisma.collegeSettings.update({
      where: { id: currentSettings.id },
      data: validatedData
    });
  } else {
    updatedSettings = await prisma.collegeSettings.create({
      data: validatedData
    });
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'COLLEGE_SETTINGS_MUTATED',
      `Modified core parameters of the institution (${validatedData.collegeName})`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Global campus configuration updated successfully.',
    data: { settings: updatedSettings }
  });
});

/**
 * 3. uploadLogo (Admin Only)
 * Saves official brand assets using multer files.
 */
export const uploadLogo = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError('Attach image file representing college logo.', 400);
  }

  const { url } = await uploadToCloudinary(req.file.path, 'brand_assets');

  let currentSettings = await prisma.collegeSettings.findFirst();

  if (currentSettings) {
    await prisma.collegeSettings.update({
      where: { id: currentSettings.id },
      data: { logoUrl: url }
    });
  } else {
    throw new AppError('Create core settings register before uploading logo asset files.', 400);
  }

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'COLLEGE_LOGO_UPLOADED',
      'Uploaded new master institutional brand assets.',
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Master institutional brand asset uploaded successfully.',
    data: { logoUrl: url }
  });
});
