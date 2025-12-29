import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { PropertyService } from '../services/property.service';
import { BookingService } from '../services/booking.service';
import { TenantService } from '../services/tenant.service';

export class OwnerController {
  private ownerService: OwnerService;
  private propertyService: PropertyService;
  private bookingService: BookingService;
  private tenantService: TenantService;

  constructor() {
    this.ownerService = new OwnerService();
    this.propertyService = new PropertyService();
    this.bookingService = new BookingService();
    this.tenantService = new TenantService();
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
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

  async getOwnerProperties(req: Request, res: Response) {
    try {
      console.log('Owner controller - req.user:', (req as any).user);
      const userId = (req as any).user?.userId;
      console.log('Owner controller - extracted userId:', userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const properties = await this.propertyService.getOwnerProperties(userId);
      res.json({ success: true, properties });
    } catch (error) {
      console.error('Error fetching owner properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  async getOwnerBookings(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      console.log('Owner bookings - userId from token:', userId);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const bookings = await this.bookingService.getOwnerBookings(userId);
      console.log('Owner bookings - result:', bookings);
      res.json({ success: true, bookings });
    } catch (error) {
      console.error('Error fetching owner bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }

  async getOwnerTenants(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const tenants = await this.tenantService.getOwnerTenants(userId);
      res.json({ success: true, tenants });
    } catch (error) {
      console.error('Error fetching owner tenants:', error);
      res.status(500).json({ error: 'Failed to fetch tenants' });
    }
  }

  async deleteProperty(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const propertyId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!propertyId || isNaN(propertyId)) {
        return res.status(400).json({ error: 'Invalid property ID' });
      }

      const deleted = await this.propertyService.deleteOwnerProperty(propertyId, userId);
      
      if (deleted) {
        res.json({ success: true, message: 'Property deleted successfully' });
      } else {
        res.status(404).json({ error: 'Property not found or not authorized' });
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const bookingId = parseInt(req.params.id);
      const { status, rejection_reason } = req.body;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({ error: 'Invalid booking ID' });
      }

      if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const updated = await this.bookingService.updateBookingStatus(bookingId, status, userId, rejection_reason);
      
      if (updated) {
        res.json({ success: true, message: 'Booking status updated successfully' });
      } else {
        res.status(404).json({ error: 'Booking not found or not authorized' });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json({ error: 'Failed to update booking status' });
    }
  }
}

export const ownerController = new OwnerController();