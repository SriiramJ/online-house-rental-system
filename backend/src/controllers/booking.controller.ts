import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    const { property_id, move_in_date, message } = req.body;

    if (!property_id || !move_in_date) {
      return res.status(400).json({
        success: false,
        message: 'Property ID and move-in date are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate move-in date
    const moveInDate = new Date(move_in_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (moveInDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Move-in date cannot be in the past',
        code: 'INVALID_DATE'
      });
    }

    const bookingService = new BookingService();
    const booking = await bookingService.createBooking({
      property_id: Number(property_id),
      tenant_id: userId,
      move_in_date,
      message: message || null
    });

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: booking
    });
  } catch (error: any) {
    logger.error('Error in createBooking controller:', error);
    
    let statusCode = 500;
    let message = 'Failed to create booking';
    let code = 'BOOKING_ERROR';
    
    if (error.message.includes('Property not found')) {
      statusCode = 404;
      message = 'Property not found';
      code = 'PROPERTY_NOT_FOUND';
    } else if (error.message.includes('not available')) {
      statusCode = 409;
      message = 'Property is not available for booking';
      code = 'PROPERTY_UNAVAILABLE';
    } else if (error.message.includes('already have a booking')) {
      statusCode = 409;
      message = error.message;
      code = 'DUPLICATE_BOOKING';
    }
    
    res.status(statusCode).json({
      success: false,
      message,
      code
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

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!['approved', 'rejected'].includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookingService = new BookingService();
    const result = await bookingService.updateBookingStatus(bookingId, status.toLowerCase(), userId, rejection_reason);
    
    if (result) {
      res.json({ success: true, message: `Booking ${status.toLowerCase()} successfully` });
    } else {
      res.status(404).json({ error: 'Booking not found or unauthorized' });
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};