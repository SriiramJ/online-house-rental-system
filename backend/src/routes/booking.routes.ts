import { Router } from 'express';
import { createBooking, getTenantBookings, getOwnerBookings, getOwnerTenants, updateBookingStatus } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/tenant', authMiddleware, getTenantBookings);
router.get('/owner/tenants', authMiddleware, getOwnerTenants);
router.get('/owner', authMiddleware, getOwnerBookings);
router.put('/:id/status', authMiddleware, updateBookingStatus);

export default router;