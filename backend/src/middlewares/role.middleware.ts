import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts";

export const roleMiddleware = (roles: string[])=>{
     return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user

    if(!user || !roles.includes(user.role)){
         logger.warn(`Access denied for role: ${user?.role}`);
      return res.status(403).json({ message: "Access denied" });
    }
    next()
}
}