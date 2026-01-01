import type { Request, Response } from "express";
import { PropertyService } from "../services/property.service.ts";
import logger from "../utils/logger.ts";

const propertyService = new PropertyService();

export const createProperty = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const propertyData = req.body;

    // Validate required fields to match frontend form
    const { title, description, rent, location, bedrooms, bathrooms, area, propertyType } = propertyData;
    
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!rent || parseFloat(rent) <= 0) {
      return res.status(400).json({ message: "Valid rent amount is required" });
    }
    if (!location?.trim()) {
      return res.status(400).json({ message: "Location is required" });
    }
    if (!bedrooms || parseInt(bedrooms) <= 0) {
      return res.status(400).json({ message: "Number of bedrooms is required" });
    }
    if (!bathrooms || parseInt(bathrooms) <= 0) {
      return res.status(400).json({ message: "Number of bathrooms is required" });
    }
    if (!area || parseInt(area) <= 0) {
      return res.status(400).json({ message: "Property area is required" });
    }
    if (!propertyType?.trim()) {
      return res.status(400).json({ message: "Property type is required" });
    }

    const property = await propertyService.createProperty(user.userId, propertyData);
    
    logger.info(`Property created successfully by user ${user.userId}`);
    res.status(201).json({
      message: "Property created successfully",
      property
    });
  } catch (error: any) {
    logger.error(`Error in createProperty: ${error.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await propertyService.getAllProperties();
    
    res.status(200).json({
      message: "Properties fetched successfully",
      properties: properties || [],
      count: properties ? properties.length : 0
    });
  } catch (error: any) {
    logger.error(`Error in getAllProperties: ${error.message}`);
    res.status(200).json({
      message: "No properties available",
      properties: [],
      count: 0
    });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        message: "Invalid property ID"
      });
    }

    const property = await propertyService.getPropertyById(Number(id));
    
    res.status(200).json({
      message: "Property fetched successfully",
      property
    });
  } catch (error: any) {
    logger.error(`Error in getPropertyById: ${error.message}`);
    
    if (error.message === "Property not found") {
      return res.status(404).json({
        message: "Property not found"
      });
    }
    
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};