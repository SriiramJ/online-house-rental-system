import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      logger.warn("User not found in request");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      logger.warn(`Access denied for role: ${user.role}`);
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};