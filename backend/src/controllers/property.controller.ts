import type { Request, Response } from "express";
import { PropertyService } from "../services/property.service.js";
import logger from "../utils/logger.js";

const propertyService = new PropertyService();

export const createProperty = async (req: Request, res: Response) => {
  try {
    logger.info('=== CREATE PROPERTY REQUEST START ===');
    const user = (req as any).user;
    const propertyData = req.body;

    logger.info('Request headers:', req.headers);
    logger.info('User from token:', { userId: user?.userId, userRole: user?.role });
    logger.info('Raw request body:', JSON.stringify(propertyData, null, 2));

    if (!user?.userId) {
      logger.error('Unauthorized: No user ID found in token');
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    logger.info(`Calling propertyService.createProperty with userId: ${user.userId}`);
    const property = await propertyService.createProperty(user.userId, propertyData);
    
    logger.info(`Property created successfully by user ${user.userId}:`, property);
    logger.info('=== CREATE PROPERTY REQUEST SUCCESS ===');
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property
    });
  } catch (error: any) {
    logger.error('=== CREATE PROPERTY REQUEST ERROR ===');
    logger.error(`Error in createProperty controller: ${error.message}`);
    logger.error('Error stack:', error.stack);
    logger.error('Error details:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create property",
      error: error.message
    });
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await propertyService.getAllProperties();
    
    res.status(200).json({
      success: true,
      message: "Properties fetched successfully",
      properties: properties || [],
      count: properties ? properties.length : 0
    });
  } catch (error: any) {
    logger.error(`Error in getAllProperties: ${error.message}`);
    res.status(200).json({
      success: true,
      message: "No properties available",
      properties: [],
      count: 0
    });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const propertyData = req.body;

    if (!user?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID"
      });
    }

    logger.info(`Updating property ${id} for user ${user.userId}`);

    const property = await propertyService.updateProperty(Number(id), user.userId, propertyData);
    
    logger.info(`Property ${id} updated successfully by user ${user.userId}`);
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property
    });
  } catch (error: any) {
    logger.error(`Error in updateProperty: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update property"
    });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID"
      });
    }

    const property = await propertyService.getPropertyById(Number(id));
    
    res.status(200).json({
      success: true,
      message: "Property fetched successfully",
      property
    });
  } catch (error: any) {
    logger.error(`Error in getPropertyById: ${error.message}`);
    
    if (error.message === "Property not found") {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};