import db from "../config/db.js";
import logger from "../utils/logger.js";

export class AdminService {
  async getSystemStatistics() {
    const connection = await db.getConnection();
    
    try {
      // Get user counts by role
      const [userStats] = await connection.execute(`
        SELECT 
          role,
          COUNT(*) as count
        FROM users 
        GROUP BY role
      `);

      // Get total properties count
      const [propertyStats] = await connection.execute(`
        SELECT COUNT(*) as total_properties FROM properties
      `);

      // Get booking statistics
      const [bookingStats] = await connection.execute(`
        SELECT 
          status,
          COUNT(*) as count
        FROM bookings 
        GROUP BY status
      `);

      // Get total bookings
      const [totalBookings] = await connection.execute(`
        SELECT COUNT(*) as total_bookings FROM bookings
      `);

      return {
        users: userStats,
        properties: (propertyStats as any[])[0]?.total_properties || 0,
        bookings: {
          total: (totalBookings as any[])[0]?.total_bookings || 0,
          by_status: bookingStats
        }
      };
    } catch (error: any) {
      logger.error(`Error fetching system statistics: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllUsers() {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT 
          id,
          name,
          email,
          role,
          phone,
          created_at
        FROM users 
        ORDER BY created_at DESC
      `);

      return rows;
    } catch (error: any) {
      logger.error(`Error fetching all users: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllPropertiesForAdmin() {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT 
          p.*,
          u.name as owner_name,
          u.email as owner_email,
          (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests,
          (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Approved') as approved_bookings
        FROM properties p 
        JOIN users u ON p.owner_id = u.id 
        ORDER BY p.created_at DESC
      `);

      return rows;
    } catch (error: any) {
      logger.error(`Error fetching all properties: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAllBookings() {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(`
        SELECT 
          b.*,
          p.title as property_title,
          p.location as property_location,
          p.rent as property_rent,
          tenant.name as tenant_name,
          tenant.email as tenant_email,
          owner.name as owner_name,
          owner.email as owner_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users tenant ON b.tenant_id = tenant.id
        JOIN users owner ON p.owner_id = owner.id
        ORDER BY b.created_at DESC
      `);

      return rows;
    } catch (error: any) {
      logger.error(`Error fetching all bookings: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }
}