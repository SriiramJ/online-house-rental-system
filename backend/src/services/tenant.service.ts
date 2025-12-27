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
}