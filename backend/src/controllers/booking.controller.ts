import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';

export const createBooking = async (req: Request, res: Response) => {
  console.log('=== CREATE BOOKING ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  console.log('User from token:', req.user);
  
  try {
    const userId = req.user?.id;
    console.log('User ID extracted:', userId);
    
    if (!userId) {
      console.log('No user ID - returning 401');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { property_id, move_in_date, message } = req.body;
    console.log('Extracted booking data:', { property_id, move_in_date, message });

    if (!property_id || !move_in_date) {
      console.log('Missing required fields - returning 400');
      return res.status(400).json({ error: 'Property ID and move-in date are required' });
    }

    console.log('Creating booking service instance...');
    const bookingService = new BookingService();
    
    console.log('Calling bookingService.createBooking...');
    const booking = await bookingService.createBooking({
      property_id: Number(property_id),
      tenant_id: userId,
      move_in_date,
      message: message || null
    });

    console.log('Booking created successfully:', booking);
    res.json({ success: true, data: booking });
  } catch (error: any) {
    console.error('Error in createBooking controller:', error);
    res.status(500).json({ error: error.message || 'Failed to create booking' });
  }
};

export const getTenantBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookingService = new BookingService();
    const bookings = await bookingService.getTenantBookings(userId);
    res.json({ success: true, data: { bookings } });
  } catch (error) {
    console.error('Error fetching tenant bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
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

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const bookingId = parseInt(req.params.id);
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookingService = new BookingService();
    const result = await bookingService.updateBookingStatus(bookingId, status, userId);
    
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