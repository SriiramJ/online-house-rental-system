import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  // Fake user (replace with JWT validation)
  (req as any).user = { userId: 1, role: "owner" };
  next();
};

export const ownerOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== "owner") {
    return res.status(403).json({ message: "Only owners can perform this action" });
  }
  next();
};