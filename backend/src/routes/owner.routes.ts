import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { roleMiddleware } from "../middlewares/role.middleware.ts";
import { 
  getOwnerDashboard, 
  getOwnerProperties, 
  getOwnerBookings, 
  getOwnerTenants,
  updateBookingStatus
} from "../controllers/owner.controller.ts";

const router = Router();

// All routes require authentication and OWNER role
router.use(authMiddleware);
router.use(roleMiddleware(['OWNER']));

// Dashboard routes
router.get("/dashboard", getOwnerDashboard);
router.get("/properties", getOwnerProperties);
router.get("/bookings", getOwnerBookings);
router.get("/tenants", getOwnerTenants);
router.put("/bookings/:bookingId/status", updateBookingStatus);

export default router;