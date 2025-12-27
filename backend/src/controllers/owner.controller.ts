import type { Request, Response } from "express";
import { PropertyService } from "../services/property.service.ts";
import { BookingService } from "../services/booking.service.ts";
import { TenantService } from "../services/tenant.service.ts";
import logger from "../utils/logger.ts";

const propertyService = new PropertyService();
const bookingService = new BookingService();
const tenantService = new TenantService();

export const getOwnerDashboard = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const ownerId = user.userId;

    // Get dashboard statistics
    const [properties, bookings, tenants] = await Promise.all([
      propertyService.getOwnerProperties(ownerId),
      bookingService.getOwnerBookingRequests(ownerId),
      tenantService.getOwnerTenants(ownerId)
    ]);

    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    const tenantsArray = Array.isArray(tenants) ? tenants : [];
    const propertiesArray = Array.isArray(properties) ? properties : [];

    const stats = {
      totalProperties: propertiesArray.length,
      pendingRequests: bookingsArray.filter((b: any) => b.status === 'Pending').length,
      activeTenants: tenantsArray.length,
      monthlyRevenue: propertiesArray.reduce((sum: number, p: any) => sum + (p.rent || 0), 0)
    };

    const recentBookings = bookingsArray
      .sort((a: any, b: any) => new Date(b.request_time).getTime() - new Date(a.request_time).getTime())
      .slice(0, 5);

    const recentTenants = tenantsArray.slice(0, 5);

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      data: {
        stats,
        recentBookings,
        recentTenants,
        properties: propertiesArray
      }
    });
  } catch (error: any) {
    logger.error(`Error in getOwnerDashboard: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getOwnerProperties = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const properties = await propertyService.getOwnerProperties(user.userId);
    
    res.status(200).json({
      message: "Properties fetched successfully",
      properties
    });
  } catch (error: any) {
    logger.error(`Error in getOwnerProperties: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getOwnerBookings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const bookings = await bookingService.getOwnerBookingRequests(user.userId);
    
    res.status(200).json({
      message: "Booking requests fetched successfully",
      bookings
    });
  } catch (error: any) {
    logger.error(`Error in getOwnerBookings: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await bookingService.updateBookingStatus(parseInt(bookingId), status, user.userId);
    
    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // If approved, create tenant record
    if (status === 'Approved') {
      await bookingService.createTenantFromBooking(parseInt(bookingId));
    }

    res.status(200).json({
      message: `Booking ${status.toLowerCase()} successfully`
    });
  } catch (error: any) {
    logger.error(`Error in updateBookingStatus: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getOwnerTenants = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const tenants = await tenantService.getOwnerTenants(user.userId);
    
    res.status(200).json({
      message: "Tenants fetched successfully",
      tenants
    });
  } catch (error: any) {
    logger.error(`Error in getOwnerTenants: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};