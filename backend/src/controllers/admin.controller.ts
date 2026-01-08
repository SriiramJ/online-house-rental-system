import type { Request, Response } from "express";
import { AdminService } from "../services/admin.service.js";
import logger from "../utils/logger.js";

const adminService = new AdminService();

export const getSystemStats = async (req: Request, res: Response) => {
  try {
    logger.info('Admin stats endpoint called');
    const stats = await adminService.getSystemStatistics();
    
    logger.info('Stats retrieved successfully:', stats);
    res.status(200).json({
      success: true,
      message: "System statistics fetched successfully",
      data: stats
    });
  } catch (error: any) {
    logger.error(`Error in getSystemStats: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch system statistics"
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error: any) {
    logger.error(`Error in getAllUsers: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await adminService.getAllPropertiesForAdmin();
    
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      data: properties
    });
  } catch (error: any) {
    logger.error(`Error in getAllProperties: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties"
    });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await adminService.getAllBookings();
    
    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: bookings
    });
  } catch (error: any) {
    logger.error(`Error in getAllBookings: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
};