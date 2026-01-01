import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import propertyRoutes from "./property.routes.js";
import ownerRoutes from "./owner.routes.js";
import tenantRoutes from "./tenant.routes.js";
import bookingRoutes from "./booking.routes.js";
import testRoutes from "./test.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/properties", propertyRoutes);
router.use("/owner", ownerRoutes);
router.use("/tenant", tenantRoutes);
router.use("/bookings", bookingRoutes);
router.use("/test", testRoutes);

export default router;