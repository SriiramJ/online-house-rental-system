import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export interface BookingData {
  property_id: number;
  tenant_id: number;
  move_in_date: string;
  message?: string;
}

export class BookingService {
  async createBooking(bookingData: BookingData) {
    try {
      logger.info(`Creating booking for property ${bookingData.property_id} by tenant ${bookingData.tenant_id}`);
      
      return await db.transaction(async (connection) => {
        // Check if property exists and is available
        const [propertyRows] = await connection.execute(
          'SELECT id, is_available, owner_id, title FROM properties WHERE id = ?',
          [bookingData.property_id]
        );

        const properties = propertyRows as any[];
        if (properties.length === 0) {
          throw new Error('Property not found');
        }

        const property = properties[0];
        if (!property.is_available) {
          throw new Error('Property is not available for booking');
        }

        // Check if tenant already has a pending/approved booking for this property
        const [existingBookings] = await connection.execute(
          'SELECT id FROM bookings WHERE property_id = ? AND tenant_id = ? AND status IN ("pending", "approved")',
          [bookingData.property_id, bookingData.tenant_id]
        );

        if ((existingBookings as any[]).length > 0) {
          throw new Error('You already have a booking request for this property');
        }

        // Create booking request
        const [result] = await connection.execute(
          `INSERT INTO bookings (property_id, tenant_id, move_in_date, message, status) 
           VALUES (?, ?, ?, ?, 'pending')`,
          [bookingData.property_id, bookingData.tenant_id, bookingData.move_in_date, bookingData.message]
        );

        const bookingId = (result as any).insertId;
        logger.info(`Booking created successfully with ID: ${bookingId}`);
        
        return {
          id: bookingId,
          ...bookingData,
          status: 'pending',
          property_title: property.title
        };
      });
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
      
      logger.info(`Found ${bookings.length} bookings for tenant ${tenantId}`);
      return bookings;
    } catch (error: any) {
      logger.error(`Error fetching tenant bookings: ${error.message}`);
      throw new Error('Failed to fetch bookings');
    }
  }

  async getOwnerBookings(ownerId: number) {
    const connection = await db.getConnection();
    
    try {
      console.log('Getting bookings for owner ID:', ownerId);
      const [rows] = await connection.execute(
        `SELECT 
          b.*,
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
        ORDER BY b.id DESC`,
        [ownerId]
      );
      
      console.log('Found bookings:', rows);
      return rows;
    } catch (error: any) {
      logger.error(`Error fetching owner bookings: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async getOwnerTenants(ownerId: number) {
    const connection = await db.getConnection();
    
    try {
      console.log('Getting tenants for owner ID:', ownerId);
      const [rows] = await connection.execute(
        `SELECT 
          b.id as booking_id,
          b.move_in_date,
          b.status as booking_status,
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
      
      console.log('Found approved tenants:', rows);
      return rows;
    } catch (error: any) {
      logger.error(`Error fetching owner tenants: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async updateBookingStatus(bookingId: number, status: string, ownerId: number, rejectionReason?: string): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update booking status and rejection reason if provided
      let query = `UPDATE bookings b
         JOIN properties p ON b.property_id = p.id
         SET b.status = ?`;
      let params = [status];
      
      if (status === 'rejected' && rejectionReason) {
        query += `, b.rejection_reason = ?`;
        params.push(rejectionReason);
      }
      
      query += ` WHERE b.id = ? AND p.owner_id = ?`;
      params.push(bookingId, ownerId);

      const [result] = await connection.execute(query, params);

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return false;
      }

      // If rejected, make property available again
      if (status === 'rejected') {
        await connection.execute(
          `UPDATE properties p
           JOIN bookings b ON p.id = b.property_id
           SET p.is_available = TRUE
           WHERE b.id = ?`,
          [bookingId]
        );
      }

      await connection.commit();
      return true;
    } catch (error: any) {
      await connection.rollback();
      logger.error(`Error updating booking status: ${error.message}`);
      return false;
    } finally {
      connection.release();
    }
  }
}