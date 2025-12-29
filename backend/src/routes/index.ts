import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import userRoutes from "./user.routes.ts";
import propertyRoutes from "./property.routes.ts";
import ownerRoutes from "./owner.routes.ts";
import tenantRoutes from "./tenant.routes.ts";
import bookingRoutes from "./booking.routes.ts";
import testRoutes from "./test.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/owner", ownerRoutes);
router.use("/tenant", tenantRoutes);
router.use("/bookings", bookingRoutes);
router.use("/test", testRoutes);

export default router;