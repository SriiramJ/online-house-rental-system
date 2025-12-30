import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export class OwnerService {
  async getDashboardData(ownerId: number) {
    const connection = await db.getConnection();
    
    try {
      // Check if tenants table exists first
      const [tableCheck] = await connection.execute(
        `SELECT COUNT(*) as count FROM information_schema.tables 
         WHERE table_schema = 'house_rental_db' AND table_name = 'tenants'`
      );
      
      const tenantsTableExists = (tableCheck as any[])[0].count > 0;

      // Get stats - simplified query without tenants if table doesn't exist
      let statsQuery;
      if (tenantsTableExists) {
        statsQuery = `SELECT 
          COUNT(DISTINCT p.id) as totalProperties,
          COUNT(DISTINCT CASE WHEN b.status = 'Pending' THEN b.id END) as pendingRequests,
          COUNT(DISTINCT t.id) as activeTenants,
          COALESCE(SUM(CASE WHEN b.status = 'Approved' THEN p.rent END), 0) as monthlyRevenue
        FROM properties p
        LEFT JOIN bookings b ON p.id = b.property_id
        LEFT JOIN tenants t ON p.id = t.property_id AND t.status = 'Active'
        WHERE p.owner_id = ?`;
      } else {
        statsQuery = `SELECT 
          COUNT(DISTINCT p.id) as totalProperties,
          COUNT(DISTINCT CASE WHEN b.status = 'Pending' THEN b.id END) as pendingRequests,
          0 as activeTenants,
          COALESCE(SUM(CASE WHEN b.status = 'Approved' THEN p.rent END), 0) as monthlyRevenue
        FROM properties p
        LEFT JOIN bookings b ON p.id = b.property_id
        WHERE p.owner_id = ?`;
      }
      
      const [statsRows] = await connection.execute(statsQuery, [ownerId]);

      // Get recent bookings with full details
      const [bookingsRows] = await connection.execute(
        `SELECT 
          b.*,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          u.name as tenant_name,
          u.email as tenant_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.tenant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY b.id DESC
        LIMIT 5`,
        [ownerId]
      );

      // Get recent tenants only if table exists
      let tenantsRows = [];
      if (tenantsTableExists) {
        const [tenantResults] = await connection.execute(
          `SELECT 
            t.*,
            u.name,
            u.email,
            p.title as property_title
          FROM tenants t
          JOIN users u ON t.tenant_id = u.id
          JOIN properties p ON t.property_id = p.id
          WHERE p.owner_id = ?
          ORDER BY t.created_at DESC
          LIMIT 5`,
          [ownerId]
        );
        tenantsRows = tenantResults as any[];
      }

      const stats = (statsRows as any[])[0] || {
        totalProperties: 0,
        pendingRequests: 0,
        activeTenants: 0,
        monthlyRevenue: 0
      };

      return {
        stats: {
          totalProperties: Number(stats.totalProperties) || 0,
          pendingRequests: Number(stats.pendingRequests) || 0,
          activeTenants: Number(stats.activeTenants) || 0,
          monthlyRevenue: Number(stats.monthlyRevenue) || 0
        },
        recentBookings: bookingsRows || [],
        recentTenants: tenantsRows || []
      };
    } catch (error: any) {
      logger.error(`Error fetching owner dashboard data: ${error.message}`);
      return {
        stats: {
          totalProperties: 0,
          pendingRequests: 0,
          activeTenants: 0,
          monthlyRevenue: 0
        },
        recentBookings: [],
        recentTenants: []
      };
    } finally {
      connection.release();
    }
  }
}