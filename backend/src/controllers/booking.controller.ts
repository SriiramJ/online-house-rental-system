import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import logger from '../utils/logger';

export const createBooking = async (req: Request, res: Response) => {
  try {
    logger.info('POST /bookings');
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const { property_id, move_in_date, message } = req.body;
    logger.info(`Creating booking for property ${property_id} by tenant ${userId}`);

    if (!property_id || !move_in_date) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and move-in date are required',
        code: 'MISSING_FIELDS'
      });
    }

    const bookingService = new BookingService();
    
    const booking = await bookingService.createBooking({
      property_id: Number(property_id),
      tenant_id: userId,
      move_in_date,
      message: message || null
    });

    logger.info(`Booking created successfully with ID: ${booking.id}`);
    logger.info(`Property ${property_id} status updated to Pending`);
    
    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: booking
    });
  } catch (error: any) {
    logger.error(`Error in createBooking controller: ${error.message}`);
    
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      code: 'BOOKING_ERROR',
      error: error.message
    });
  }
};

export const getTenantBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const bookingService = new BookingService();
    const bookings = await bookingService.getTenantBookings(userId);
    
    res.json({
      success: true,
      data: { bookings },
      count: bookings.length
    });
  } catch (error: any) {
    logger.error('Error fetching tenant bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      code: 'FETCH_ERROR'
    });
  }
};

export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingService = new BookingService();
    const bookings = await bookingService.getOwnerBookings(userId);
    res.json({ success: true, data: { bookings } });
  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getOwnerTenants = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingService = new BookingService();
    const tenants = await bookingService.getOwnerTenants(userId);
    res.json({ success: true, tenants });
  } catch (error) {
    console.error('Error fetching owner tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const bookingId = parseInt(req.params.id);
    const { status, rejection_reason } = req.body;

    logger.info(`Updating booking ${bookingId} status to ${status} by user ${userId}`);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    if (!bookingId || isNaN(bookingId)) {
      return res.status(400).json({ success: false, error: 'Invalid booking ID' });
    }

    if (!status || !['approved', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const bookingService = new BookingService();
    const result = await bookingService.updateBookingStatus(
      bookingId, 
      status.toLowerCase(), 
      userId, 
      rejection_reason || ''
    );
    
    if (result) {
      res.json({ success: true, message: `Booking ${status.toLowerCase()} successfully` });
    } else {
      res.status(404).json({ success: false, error: 'Booking not found or unauthorized' });
    }
  } catch (error: any) {
    logger.error('Error updating booking status:', error);
    res.status(500).json({ success: false, error: 'Failed to update booking status', details: error.message });
  }
};