import { Router } from 'express';
import { tenantController } from '../controllers/tenant.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/bookings', authenticateToken, tenantController.getTenantBookings);
router.get('/dashboard', authenticateToken, tenantController.getTenantDashboard);

export default router;