import { Router } from "express";
import propertyRoutes from "./property.routes.ts";
import authRoutes from "./auth.routes.ts";

const router = Router();

router.use("/properties", propertyRoutes);

export default router;