import { Request, Response } from 'express';
import { OwnerService } from '../services/owner.service';
import { PropertyService } from '../services/property.service';
import { BookingService } from '../services/booking.service';
import { TenantService } from '../services/tenant.service';
import logger from '../utils/logger';

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
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const dashboardData = await this.ownerService.getDashboardData(userId);
      res.json({
        success: true,
        message: 'Dashboard data fetched successfully',
        data: dashboardData
      });
    } catch (error: any) {
      console.error('Error fetching owner dashboard data:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard data'
      });
    }
  }

  async getOwnerProperties(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const properties = await this.propertyService.getOwnerProperties(userId);
      res.json({
        success: true,
        message: 'Properties fetched successfully',
        properties
      });
    } catch (error: any) {
      console.error('Error fetching owner properties:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch properties'
      });
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

  async getOwnerProperty(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = req.user?.userId;
      const propertyId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      if (!propertyId || isNaN(propertyId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid property ID'
        });
      }

      const property = await this.propertyService.getPropertyById(propertyId);
      
      // Verify ownership
      if (property.owner_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
      
      res.json({
        success: true,
        message: 'Property fetched successfully',
        property
      });
    } catch (error: any) {
      logger.error(`Error fetching owner property: ${error.message}`);
      
      if (error.message === 'Property not found') {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to fetch property'
      });
    }
  }
  async createProperty(req: Request, res: Response) {
    try {
      logger.info('=== OWNER CONTROLLER CREATE PROPERTY START ===');
      const userId = req.user?.userId;
      logger.info('User ID from token:', userId);
      
      if (!userId) {
        logger.error('No user ID found in token');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      const propertyData = req.body;
      logger.info('Property data received in owner controller:', JSON.stringify(propertyData, null, 2));
      logger.info(`Creating property for user ${userId}:`, propertyData);
      
      logger.info('Calling PropertyService.createProperty...');
      const property = await this.propertyService.createProperty(userId, propertyData);
      
      logger.info('Property created successfully in owner controller:', property);
      logger.info('=== OWNER CONTROLLER CREATE PROPERTY SUCCESS ===');
      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        property
      });
    } catch (error: any) {
      logger.error('=== OWNER CONTROLLER CREATE PROPERTY ERROR ===');
      logger.error('Error creating property in owner controller:', error);
      logger.error('Error message:', error.message);
      logger.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create property'
      });
    }
  }

  async deleteProperty(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = req.user?.userId;
      const propertyId = parseInt(req.params.id);
      
      if (!userId) {
        return res.status(401).json({ 
          success: false,
          message: 'Unauthorized' 
        });
      }

      if (!propertyId || isNaN(propertyId)) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid property ID' 
        });
      }

      logger.info(`Deleting property ${propertyId} for owner ${userId}`);
      const deleted = await this.propertyService.deleteOwnerProperty(propertyId, userId);
      
      if (deleted) {
        logger.info(`Property ${propertyId} deleted successfully by owner ${userId}`);
        res.json({ 
          success: true, 
          message: 'Property deleted successfully' 
        });
      } else {
        logger.warn(`Property ${propertyId} not found or not authorized for owner ${userId}`);
        res.status(404).json({ 
          success: false,
          message: 'Property not found or not authorized' 
        });
      }
    } catch (error: any) {
      logger.error(`Error deleting property: ${error.message}`);
      res.status(500).json({ 
        success: false,
        message: 'Failed to delete property' 
      });
    }
  }

  async updateBookingStatus(req: Request<{ id: string }>, res: Response) {
    try {
      const userId = req.user?.userId;
      const bookingId = parseInt(req.params.id);
      const { status, rejection_reason } = req.body;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }

      if (!bookingId || isNaN(bookingId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid booking ID'
        });
      }

      if (!status || !['approved', 'rejected'].includes(status.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      // Convert to capitalized format for database
      const dbStatus = status.toLowerCase() === 'approved' ? 'Approved' : 'Rejected';
      const updated = await this.bookingService.updateBookingStatus(bookingId, dbStatus, userId, rejection_reason);
      
      if (updated) {
        res.json({
          success: true,
          message: 'Booking status updated successfully'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Booking not found or not authorized'
        });
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status'
      });
    }
  }
}

export const ownerController = new OwnerController();