import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';

export class OwnerController {
  private ownerService: OwnerService;

  constructor() {
    this.ownerService = new OwnerService();
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const dashboardData = await this.ownerService.getDashboardData(userId);
      res.json({ success: true, data: dashboardData });
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  }
}

export const ownerController = new OwnerController();