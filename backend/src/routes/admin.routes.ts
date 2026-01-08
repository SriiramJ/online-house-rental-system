import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { getSystemStats, getAllUsers, getAllProperties, getAllBookings } from "../controllers/admin.controller.js";

const router = Router();

// Test route to verify admin routes are working
router.get("/test", (req, res) => {
  console.log('Admin test route called');
  res.json({ success: true, message: "Admin routes are working", timestamp: new Date() });
});

// All admin routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// Admin dashboard statistics
router.get("/stats", getSystemStats);

// Admin data access routes
router.get("/users", getAllUsers);
router.get("/properties", getAllProperties);
router.get("/bookings", getAllBookings);

export default router;