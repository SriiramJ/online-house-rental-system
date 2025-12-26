import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import userRoutes from "./user.routes.ts";
import propertyRoutes from "./property.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/properties", propertyRoutes);

export default router;