import { Router } from "express";
import { getUserProfile, logout } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logout);

export default router;