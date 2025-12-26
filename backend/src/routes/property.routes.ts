import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { roleMiddleware } from "../middlewares/role.middleware.ts";
import { createProperty, getAllProperties, getPropertyById } from "../controllers/property.controller.ts";

const router = Router();

// Public routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// Protected routes (Owner only)
router.post("/", authMiddleware, roleMiddleware(['OWNER']), createProperty);

export default router;