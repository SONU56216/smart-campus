import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../config/database';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { adminCreateSchema } from '../utils/validators';
import { hashPassword } from '../utils/password';
import { logAdminActivity } from '../middleware/audit';

/**
 * 1. getAllAdmins (Super Admin Only)
 * Lists all registered administration users with full permission flags.
 */
export const getAllAdmins = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
      permissions: true,
      createdAt: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: { admins }
  });
});

/**
 * 2. createAdmin (Super Admin Only)
 * Creates new accounts under targeted role categories.
 */
export const createAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const validated = await adminCreateSchema.parseAsync(req.body);

  const existing = await prisma.admin.findUnique({
    where: { email: validated.email }
  });

  if (existing) {
    throw new AppError('An administrator with this email is already registered.', 400);
  }

  const hashedPassword = await hashPassword(validated.password);

  const newAdmin = await prisma.admin.create({
    data: {
      fullName: validated.fullName,
      email: validated.email,
      password: hashedPassword,
      role: validated.role,
      permissions: validated.permissions || [],
      isActive: true
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMIN_USER_CREATED',
      `Provisioned a new administrator account of role ${validated.role} for email ${validated.email}`,
      req
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Admin user created successfully.',
    data: {
      admin: {
        id: newAdmin.id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
        role: newAdmin.role,
        permissions: newAdmin.permissions
      }
    }
  });
});

/**
 * 3. updateAdmin (Super Admin Only)
 * Modifies roles, email address details, active parameters, or permission segments of admins.
 */
export const updateAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { fullName, role, permissions, isActive } = req.body;

  const admin = await prisma.admin.findUnique({
    where: { id }
  });

  if (!admin) {
    throw new AppError('The administrator profile record was not found.', 404);
  }

  // Prevent Super Administrators from disabling themselves
  if (admin.id === req.user?.id && isActive === false) {
    throw new AppError('Self-Lockout Blocked. You cannot deactivate your active administrator profile.', 400);
  }

  const updated = await prisma.admin.update({
    where: { id },
    data: {
      fullName: fullName !== undefined ? fullName : admin.fullName,
      role: role !== undefined ? role : admin.role,
      permissions: permissions !== undefined ? permissions : admin.permissions,
      isActive: isActive !== undefined ? isActive : admin.isActive
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      permissions: true,
      isActive: true
    }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMIN_USER_UPDATED',
      `Modified core parameters of administrator profile: ${admin.email}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Administrator user updated successfully.',
    data: { admin: updated }
  });
});

/**
 * 4. deleteAdmin (Super Admin Only)
 */
export const deleteAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (id === req.user?.id) {
    throw new AppError('Conflict. You cannot delete your logged-in administrator account.', 400);
  }

  const exists = await prisma.admin.findUnique({
    where: { id }
  });

  if (!exists) {
    throw new AppError('Administrator profile does not exist.', 404);
  }

  await prisma.admin.delete({
    where: { id }
  });

  if (req.user?.id) {
    await logAdminActivity(
      req.user.id,
      'ADMIN_USER_PURGED',
      `Fully removed administrative profile reference of email: ${exists.email}`,
      req
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Administrator account destroyed and references removed successfully.'
  });
});
