import { Router } from "express";
import type { Request, Response } from "express";
import logger from "../utils/logger.ts";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  logger.info("Health check API called");

  res.status(200).json({
    status: "OK",
    message: "Backend is running",
  });
});

export default router;
