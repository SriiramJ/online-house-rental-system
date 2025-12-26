import { Router } from "express";
import { getUserProfile, logout } from "../controllers/user.controller.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logout);

export default router;