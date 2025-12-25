import { Router } from "express";
import { addProperty, getProperties, getPropertyById } from "../controllers/property.controller.ts";
import { authMiddleware, ownerOnly } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/", getProperties); // Public: view properties
router.post("/", authMiddleware, ownerOnly, addProperty); // Protected: owners only
router.get("/:id", getPropertyById);
export default router;