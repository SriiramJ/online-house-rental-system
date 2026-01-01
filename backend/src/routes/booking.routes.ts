import { Router } from 'express';
import { createBooking, getTenantBookings, getOwnerBookings, getOwnerTenants, updateBookingStatus } from '../controllers/booking.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/tenant', authMiddleware, getTenantBookings);
router.get('/owner/tenants', authMiddleware, getOwnerTenants);
router.get('/owner', authMiddleware, getOwnerBookings);
router.put('/:id/status', authMiddleware, updateBookingStatus);

export default router;