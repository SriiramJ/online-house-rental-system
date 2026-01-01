import { Router } from 'express';
import { tenantController } from '../controllers/tenant.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/bookings', authMiddleware, tenantController.getTenantBookings.bind(tenantController));
router.get('/dashboard', authMiddleware, tenantController.getTenantDashboard.bind(tenantController));

export default router;