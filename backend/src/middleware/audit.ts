import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';

/**
 * Standalone helper to manually record an administrative event to the ledger
 */
export const logAdminActivity = async (
  adminId: string,
  action: string,
  description: string,
  req?: Request
): Promise<void> => {
  try {
    const ipAddress = req ? (req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null) : null;
    
    await prisma.adminActivity.create({
      data: {
        adminId,
        action,
        description,
        ipAddress,
      }
    });
  } catch (err) {
    console.error('Failed to log admin action to AdminActivity ledger:', err);
  }
};

/**
 * Express middleware factory to audit-log administrative activities automatically upon successful route completions
 */
export const auditLog = (action: string, buildDescription?: (req: any) => string) => {
  return (req: any, res: Response, next: NextFunction): void => {
    // Intercept finish event to ensure we only log completed, successful system mutative updates
    res.on('finish', async () => {
      try {
        const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
        const adminId = req.user?.id || req.admin?.id; // supports standard or admin property bindings

        if (isSuccess && adminId) {
          const description = buildDescription 
            ? buildDescription(req) 
            : `Admin performed ${action} on ${req.method} ${req.originalUrl}`;
          
          const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null;

          await prisma.adminActivity.create({
            data: {
              adminId,
              action,
              description,
              ipAddress
            }
          });
        }
      } catch (error) {
        console.error('Middleware failure recording administrative audit logs:', error);
      }
    });

    next();
  };
};
