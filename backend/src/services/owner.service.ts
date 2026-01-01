import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export class OwnerService {
  async getDashboardData(ownerId: number) {
    try {
      if (!ownerId || ownerId <= 0) {
        throw new Error('Invalid owner ID');
      }

      logger.info(`Fetching dashboard data for owner: ${ownerId}`);

      // Get basic stats
      const stats = await db.query(
        `SELECT 
          COUNT(DISTINCT p.id) as totalProperties,
          COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) as pendingRequests,
          COUNT(DISTINCT CASE WHEN b.status = 'approved' THEN b.id END) as activeTenants,
          COALESCE(SUM(CASE WHEN b.status = 'approved' THEN p.rent END), 0) as monthlyRevenue
        FROM properties p
        LEFT JOIN bookings b ON p.id = b.property_id
        WHERE p.owner_id = ?`,
        [ownerId]
      );

      // Get recent bookings
      const recentBookings = await db.query(
        `SELECT 
          b.id,
          b.status,
          b.move_in_date,
          b.created_at,
          p.title as property_title,
          p.location as property_location,
          p.rent,
          u.name as tenant_name,
          u.email as tenant_email
        FROM bookings b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.tenant_id = u.id
        WHERE p.owner_id = ?
        ORDER BY b.created_at DESC
        LIMIT 5`,
        [ownerId]
      );

      const dashboardStats = stats[0] || {
        totalProperties: 0,
        pendingRequests: 0,
        activeTenants: 0,
        monthlyRevenue: 0
      };

      return {
        stats: {
          totalProperties: Number(dashboardStats.totalProperties) || 0,
          pendingRequests: Number(dashboardStats.pendingRequests) || 0,
          activeTenants: Number(dashboardStats.activeTenants) || 0,
          monthlyRevenue: Number(dashboardStats.monthlyRevenue) || 0
        },
        recentBookings: recentBookings || [],
        recentTenants: []
      };
    } catch (error: any) {
      logger.error(`Error fetching owner dashboard data: ${error.message}`);
      throw error;
    }
  }
}