import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export interface BookingRequest {
  id?: number;
  property_id: number;
  tenant_id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  move_in_date?: string;
  lease_duration?: string;
  message?: string;
  request_time?: Date;
  property_title?: string;
  property_location?: string;
  property_rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
}

export class BookingService {
  async getOwnerBookingRequests(ownerId: number): Promise<BookingRequest[]> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT b.*, p.title as property_title, p.location as property_location, p.rent as property_rent,
         u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone
         FROM bookings b
         JOIN properties p ON b.property_id = p.id
         JOIN users u ON b.tenant_id = u.id
         WHERE p.owner_id = ?
         ORDER BY b.request_time DESC`,
        [ownerId]
      );

      return rows as BookingRequest[];
    } catch (error: any) {
      logger.error(`Error fetching booking requests: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async updateBookingStatus(bookingId: number, status: 'Approved' | 'Rejected', ownerId: number): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        `UPDATE bookings b
         JOIN properties p ON b.property_id = p.id
         SET b.status = ?
         WHERE b.id = ? AND p.owner_id = ?`,
        [status, bookingId, ownerId]
      );

      return (result as any).affectedRows > 0;
    } catch (error: any) {
      logger.error(`Error updating booking status: ${error.message}`);
      return false;
    } finally {
      connection.release();
    }
  }

  async createTenantFromBooking(bookingId: number): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Get booking details
      const [bookingRows] = await connection.execute(
        `SELECT b.*, p.rent FROM bookings b
         JOIN properties p ON b.property_id = p.id
         WHERE b.id = ? AND b.status = 'Approved'`,
        [bookingId]
      );

      if ((bookingRows as any[]).length === 0) {
        throw new Error('Booking not found or not approved');
      }

      const booking = (bookingRows as any[])[0];
      
      // Calculate lease end date (default 12 months if not specified)
      const leaseStart = new Date(booking.move_in_date || new Date());
      const leaseEnd = new Date(leaseStart);
      const duration = booking.lease_duration || '12 months';
      const months = parseInt(duration) || 12;
      leaseEnd.setMonth(leaseEnd.getMonth() + months);

      // Create tenant record
      await connection.execute(
        `INSERT INTO tenants (property_id, tenant_id, lease_start, lease_end, monthly_rent, status)
         VALUES (?, ?, ?, ?, ?, 'Active')`,
        [booking.property_id, booking.tenant_id, leaseStart, leaseEnd, booking.rent]
      );

      // Update property availability
      await connection.execute(
        `UPDATE properties SET is_available = FALSE WHERE id = ?`,
        [booking.property_id]
      );

      await connection.commit();
      return true;
    } catch (error: any) {
      await connection.rollback();
      logger.error(`Error creating tenant from booking: ${error.message}`);
      return false;
    } finally {
      connection.release();
    }
  }
}