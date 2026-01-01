import db from "../config/db";
import logger from "../utils/logger";

export interface BookingData {
  property_id: number;
  tenant_id: number;
  move_in_date: string;
  message?: string;
}

export class BookingService {
  async createBooking(bookingData: BookingData) {
    try {
      const result = await db.transaction(async (connection) => {
        // Check if tenant already has a booking for this property
        const [existingBookingRows] = await connection.execute(
          'SELECT id FROM bookings WHERE property_id = ? AND tenant_id = ? AND status IN ("Pending", "Approved")',
          [bookingData.property_id, bookingData.tenant_id]
        );

        if ((existingBookingRows as any[]).length > 0) {
          throw new Error('You already have a booking request for this property');
        }

        // Check if property exists and is available
        const [propertyRows] = await connection.execute(
          'SELECT id, status, owner_id, title FROM properties WHERE id = ?',
          [bookingData.property_id]
        );

        const properties = propertyRows as any[];
        if (properties.length === 0) {
          throw new Error('Property not found');
        }

        const property = properties[0];
        const isAvailable = property.status === 'Available';
        
        if (!isAvailable) {
          throw new Error('Property is not available for booking');
        }

        // Create booking request
        const [insertResult] = await connection.execute(
          `INSERT INTO bookings (property_id, tenant_id, move_in_date, message, status) 
           VALUES (?, ?, ?, ?, 'Pending')`,
          [bookingData.property_id, bookingData.tenant_id, bookingData.move_in_date, bookingData.message || null]
        );

        const bookingId = (insertResult as any).insertId;

        // Mark property as pending
        await connection.execute(
          'UPDATE properties SET status = ? WHERE id = ?',
          ['Pending', bookingData.property_id]
        );
        
        return {
          id: bookingId,
          ...bookingData,
          status: 'Pending',
          property_title: property.title
        };
      });
      
      return result;
    } catch (error: any) {
      logger.error(`Error creating booking: ${error.message}`);
      throw error;
    }
  }

  async getTenantBookings(tenantId: number) {
    try {
      if (!tenantId || tenantId <= 0) {
        throw new Error('Invalid tenant ID');
      }

      logger.info(`Fetching bookings for tenant ID: ${tenantId}`);
      
      const bookings = await db.query(
        `SELECT 
          b.id,
          b.property_id,
          b.move_in_date,
          b.message,
          b.status,
          b.rejection_reason,
          b.created_at,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          p.photos as property_photos,
          u.name as owner_name,
          u.email as owner_email,
          u.phone as owner_phone
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON p.owner_id = u.id
        WHERE b.tenant_id = ?
        ORDER BY b.created_at DESC`,
        [tenantId]
      );
      
      // Capitalize status for frontend display
      const formattedBookings = bookings.map((booking: any) => ({
        ...booking,
        status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
      }));
      
      logger.info(`Found ${formattedBookings.length} bookings for tenant ${tenantId}`);
      return formattedBookings;
    } catch (error: any) {
      logger.error(`Error fetching tenant bookings: ${error.message}`);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getOwnerBookings(ownerId: number) {
    try {
      if (!ownerId || ownerId <= 0) {
        throw new Error('Invalid owner ID');
      }

      logger.info(`Getting bookings for owner ID: ${ownerId}`);
      
      const bookings = await db.query(
        `SELECT 
          b.id,
          b.property_id,
          b.move_in_date,
          b.message,
          b.status,
          b.rejection_reason,
          b.created_at,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          p.photos as property_photos,
          u.name as tenant_name,
          u.email as tenant_email,
          u.phone as tenant_phone
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.tenant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY b.created_at DESC`,
        [ownerId]
      );
      
      logger.info(`Found ${bookings.length} bookings for owner ${ownerId}`);
      return bookings;
    } catch (error: any) {
      logger.error(`Error fetching owner bookings: ${error.message}`);
      throw new Error('Failed to fetch owner bookings');
    }
  }

  async getOwnerTenants(ownerId: number) {
    try {
      if (!ownerId || ownerId <= 0) {
        throw new Error('Invalid owner ID');
      }

      logger.info(`Getting tenants for owner ID: ${ownerId}`);
      
      const tenants = await db.query(
        `SELECT 
          b.id as booking_id,
          b.move_in_date,
          b.status as booking_status,
          b.created_at,
          p.id as property_id,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          p.photos as property_photos,
          u.id as tenant_id,
          u.name as tenant_name,
          u.email as tenant_email,
          u.phone as tenant_phone
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.tenant_id = u.id
        WHERE p.owner_id = ? AND LOWER(b.status) = 'approved'
        ORDER BY b.move_in_date DESC`,
        [ownerId]
      );
      
      logger.info(`Found ${tenants.length} approved tenants for owner ${ownerId}`);
      return tenants;
    } catch (error: any) {
      logger.error(`Error fetching owner tenants: ${error.message}`);
      throw new Error('Failed to fetch tenants');
    }
  }

  async updateBookingStatus(bookingId: number, status: string, ownerId: number, rejectionReason?: string): Promise<boolean> {
    try {
      if (!bookingId || !status || !ownerId) {
        throw new Error('Missing required parameters');
      }
      
      logger.info(`Updating booking ${bookingId} to status ${status} by owner ${ownerId}`);
      
      return await db.transaction(async (connection) => {
        // First verify the booking exists and belongs to the owner
        const [bookingCheck] = await connection.execute(
          `SELECT b.id, b.property_id, p.owner_id 
           FROM bookings b 
           JOIN properties p ON b.property_id = p.id 
           WHERE b.id = ? AND p.owner_id = ?`,
          [bookingId, ownerId]
        );

        if ((bookingCheck as any[]).length === 0) {
          logger.error(`Booking ${bookingId} not found or not owned by user ${ownerId}`);
          return false;
        }

        const booking = (bookingCheck as any[])[0];
        const propertyId = booking.property_id;

        // Update booking status
        let updateQuery = 'UPDATE bookings SET status = ?';
        let params = [status];
        
        if (status.toLowerCase() === 'rejected' && rejectionReason) {
          updateQuery += ', rejection_reason = ?';
          params.push(rejectionReason);
        }
        
        updateQuery += ' WHERE id = ?';
        params.push(bookingId);

        const [result] = await connection.execute(updateQuery, params);

        if ((result as any).affectedRows === 0) {
          logger.error(`Failed to update booking ${bookingId}`);
          return false;
        }

        // Update property status based on booking status
        if (status.toLowerCase() === 'rejected') {
          await connection.execute(
            'UPDATE properties SET status = "Available" WHERE id = ?',
            [propertyId]
          );
          logger.info(`Property ${propertyId} made available after booking rejection`);
        } else if (status.toLowerCase() === 'approved') {
          await connection.execute(
            'UPDATE properties SET status = "Rented" WHERE id = ?',
            [propertyId]
          );
          logger.info(`Property ${propertyId} marked as rented after booking approval`);
        }

        logger.info(`Booking ${bookingId} status updated to ${status} successfully`);
        return true;
      });
    } catch (error: any) {
      logger.error(`Error updating booking status: ${error.message}`);
      throw error;
    }
  }
}