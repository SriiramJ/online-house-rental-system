import type { Request, Response, NextFunction } from "express";

export const ownerOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user || user.role !== "OWNER") {
    return res.status(403).json({ message: "Owner access only" });
  }

  next();
};
