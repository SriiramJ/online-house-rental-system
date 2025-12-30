import { Request, Response } from 'express';
import { TenantService } from '../services/tenant.service';

export class TenantController {
  private tenantService: TenantService;

  constructor() {
    this.tenantService = new TenantService();
  }

  async getTenantBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      console.log('Tenant bookings - userId from token:', userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const bookings = await this.tenantService.getTenantBookings(userId);
      console.log('Tenant bookings - result:', bookings);
      res.json({ success: true, data: { bookings } });
    } catch (error) {
      console.error('Error fetching tenant bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async getTenantDashboard(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      console.log('Tenant dashboard - userId from token:', userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const dashboardData = await this.tenantService.getTenantDashboard(userId);
      console.log('Tenant dashboard - result:', dashboardData);
      res.json({ success: true, data: dashboardData });
    } catch (error) {
      console.error('Error fetching tenant dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
}

export const tenantController = new TenantController();