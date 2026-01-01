import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('=== ROLE MIDDLEWARE START ===');
      logger.info('Required roles:', allowedRoles);
      
      const user = (req as any).user;
      logger.info('User from request:', user ? { userId: user.userId, role: user.role } : 'No user found');
      
      if (!user) {
        logger.warn("User not found in request - auth middleware may not be applied");
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "USER_NOT_AUTHENTICATED"
        });
      }
      
      if (!user.role) {
        logger.warn(`User ${user.userId} has no role assigned`);
        return res.status(403).json({
          success: false,
          message: "Access denied. No role assigned.",
          code: "NO_ROLE_ASSIGNED"
        });
      }
      
      if (!allowedRoles.includes(user.role)) {
        logger.warn(`User ${user.userId} with role ${user.role} attempted to access resource requiring roles: ${allowedRoles.join(', ')}`);
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          code: "INSUFFICIENT_PERMISSIONS"
        });
      }
      
      logger.info(`Role check passed for user ${user.userId} with role ${user.role}`);
      logger.info('=== ROLE MIDDLEWARE SUCCESS ===');
      next();
    } catch (error: any) {
      logger.error('=== ROLE MIDDLEWARE ERROR ===');
      logger.error(`Role middleware error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authorization",
        code: "AUTHORIZATION_ERROR"
      });
    }
  };
};