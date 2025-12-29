import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export interface Tenant {
  id?: number;
  property_id: number;
  tenant_id: number;
  lease_start: Date;
  lease_end: Date;
  monthly_rent: number;
  security_deposit?: number;
  status: 'Active' | 'Expired' | 'Terminated';
  created_at?: Date;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  property_title?: string;
  property_location?: string;
}

export class TenantService {
  async getOwnerTenants(ownerId: number): Promise<Tenant[]> {
    const connection = await db.getConnection();
    
    try {
      // Check if tenants table exists first
      const [tableCheck] = await connection.execute(
        `SELECT COUNT(*) as count FROM information_schema.tables 
         WHERE table_schema = 'house_rental_db' AND table_name = 'tenants'`
      );
      
      if ((tableCheck as any[])[0].count === 0) {
        logger.info('Tenants table does not exist yet');
        return [];
      }

      const [rows] = await connection.execute(
        `SELECT t.*, u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone,
         p.title as property_title, p.location as property_location
         FROM tenants t
         JOIN users u ON t.tenant_id = u.id
         JOIN properties p ON t.property_id = p.id
         WHERE p.owner_id = ?
         ORDER BY t.created_at DESC`,
        [ownerId]
      );

      return rows as Tenant[];
    } catch (error: any) {
      logger.error(`Error fetching owner tenants: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async updateTenantStatus(tenantId: number, status: 'Active' | 'Expired' | 'Terminated', ownerId: number): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update tenant status
      const [result] = await connection.execute(
        `UPDATE tenants t
         JOIN properties p ON t.property_id = p.id
         SET t.status = ?
         WHERE t.id = ? AND p.owner_id = ?`,
        [status, tenantId, ownerId]
      );

      // If terminating lease, make property available
      if (status === 'Terminated' || status === 'Expired') {
        await connection.execute(
          `UPDATE properties p
           JOIN tenants t ON p.id = t.property_id
           SET p.is_available = TRUE
           WHERE t.id = ? AND p.owner_id = ?`,
          [tenantId, ownerId]
        );
      }

      await connection.commit();
      return (result as any).affectedRows > 0;
    } catch (error: any) {
      await connection.rollback();
      logger.error(`Error updating tenant status: ${error.message}`);
      return false;
    } finally {
      connection.release();
    }
  }

  async getTenantDetails(tenantId: number, ownerId: number): Promise<Tenant | null> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT t.*, u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone,
         p.title as property_title, p.location as property_location
         FROM tenants t
         JOIN users u ON t.tenant_id = u.id
         JOIN properties p ON t.property_id = p.id
         WHERE t.id = ? AND p.owner_id = ?`,
        [tenantId, ownerId]
      );

      const tenants = rows as Tenant[];
      return tenants.length > 0 ? tenants[0] : null;
    } catch (error: any) {
      logger.error(`Error fetching tenant details: ${error.message}`);
      return null;
    } finally {
      connection.release();
    }
  }

  async getTenantBookings(userId: number) {
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
        ORDER BY b.created_at DESC`,
        [userId]
      );
      
      return rows;
    } catch (error: any) {
      logger.error(`Error fetching tenant bookings: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async getTenantStats(userId: number) {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT 
          COUNT(*) as totalBookings,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingBookings,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approvedBookings,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejectedBookings
        FROM bookings 
        WHERE tenant_id = ?`,
        [userId]
      );
      
      const stats = (rows as any[])[0] || {
        totalBookings: 0,
        pendingBookings: 0,
        approvedBookings: 0,
        rejectedBookings: 0
      };
      
      return {
        totalBookings: Number(stats.totalBookings) || 0,
        pendingBookings: Number(stats.pendingBookings) || 0,
        approvedBookings: Number(stats.approvedBookings) || 0,
        rejectedBookings: Number(stats.rejectedBookings) || 0
      };
    } catch (error: any) {
      logger.error(`Error fetching tenant stats: ${error.message}`);
      return {
        totalBookings: 0,
        pendingBookings: 0,
        approvedBookings: 0,
        rejectedBookings: 0
      };
    } finally {
      connection.release();
    }
  }

  async getTenantDashboard(userId: number) {
    const connection = await db.getConnection();
    
    try {
      // Get tenant stats
      const stats = await this.getTenantStats(userId);
      
      // Get recent bookings
      const [bookingsRows] = await connection.execute(
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
        ORDER BY b.id DESC
        LIMIT 5`,
        [userId]
      );
      
      return {
        stats,
        recentBookings: bookingsRows || []
      };
    } catch (error: any) {
      logger.error(`Error fetching tenant dashboard: ${error.message}`);
      return {
        stats: {
          totalBookings: 0,
          pendingBookings: 0,
          approvedBookings: 0,
          rejectedBookings: 0
        },
        recentBookings: []
      };
    } finally {
      connection.release();
    }
  }
}