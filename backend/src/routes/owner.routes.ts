import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ownerController } from "../controllers/owner.controller.js";

const router = Router();

// All routes require authentication and OWNER role
router.use(authMiddleware);
router.use(roleMiddleware(['OWNER']));

// Dashboard routes
router.get("/dashboard", ownerController.getDashboardData.bind(ownerController));
router.get("/properties", ownerController.getOwnerProperties.bind(ownerController));
router.get("/properties/:id", ownerController.getOwnerProperty.bind(ownerController));
router.post("/properties", ownerController.createProperty.bind(ownerController));
router.get("/bookings", ownerController.getOwnerBookings.bind(ownerController));
router.get("/tenants", ownerController.getOwnerTenants.bind(ownerController));
router.delete("/properties/:id", ownerController.deleteProperty.bind(ownerController));
router.put("/bookings/:id/status", ownerController.updateBookingStatus.bind(ownerController));

export default router;