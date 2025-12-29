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
    console.log('=== BOOKING SERVICE CREATE BOOKING ===');
    console.log('Booking data received:', bookingData);
    
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      console.log('Database transaction started');

      // Check if property exists and is available
      console.log('Checking property availability...');
      const [propertyRows] = await connection.execute(
        'SELECT id, is_available, owner_id FROM properties WHERE id = ?',
        [bookingData.property_id]
      );

      const properties = propertyRows as any[];
      console.log('Property query result:', properties);
      
      if (properties.length === 0) {
        throw new Error('Property not found');
      }

      const property = properties[0];
      if (!property.is_available) {
        throw new Error('Property is not available for booking');
      }

      // Create booking request
      console.log('Inserting booking into database...');
      const [result] = await connection.execute(
        `INSERT INTO bookings (property_id, tenant_id, move_in_date, message, status) 
         VALUES (?, ?, ?, ?, 'Pending')`,
        [bookingData.property_id, bookingData.tenant_id, bookingData.move_in_date, bookingData.message]
      );
      
      console.log('Booking insert result:', result);

      // Update property availability to false
      console.log('Updating property availability...');
      await connection.execute(
        'UPDATE properties SET is_available = FALSE WHERE id = ?',
        [bookingData.property_id]
      );

      await connection.commit();
      console.log('Transaction committed successfully');
      
      const bookingResult = {
        id: (result as any).insertId,
        ...bookingData,
        status: 'Pending'
      };
      
      console.log('Returning booking result:', bookingResult);
      return bookingResult;
    } catch (error: any) {
      await connection.rollback();
      console.error('Error in createBooking service:', error);
      logger.error(`Error creating booking: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getTenantBookings(tenantId: number) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT 
          b.*,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          p.photos as property_photos,
          u.name as owner_name,
          u.email as owner_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON p.owner_id = u.id
        WHERE b.tenant_id = ?
        ORDER BY b.id DESC`,
        [tenantId]
      );
      
      return rows;
    } catch (error: any) {
      logger.error(`Error fetching tenant bookings: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async getOwnerBookings(ownerId: number) {
    const connection = await db.getConnection();
    
    try {
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
      
      return rows;
    } catch (error: any) {
      logger.error(`Error fetching owner bookings: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async updateBookingStatus(bookingId: number, status: string, ownerId: number): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update booking status
      const [result] = await connection.execute(
        `UPDATE bookings b
         JOIN properties p ON b.property_id = p.id
         SET b.status = ?
         WHERE b.id = ? AND p.owner_id = ?`,
        [status, bookingId, ownerId]
      );

      if ((result as any).affectedRows === 0) {
        await connection.rollback();
        return false;
      }

      // If rejected, make property available again
      if (status === 'Rejected') {
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