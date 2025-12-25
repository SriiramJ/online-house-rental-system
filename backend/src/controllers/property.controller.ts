import type { Request, Response } from "express";
import db from "../config/db.ts";
import logger from "../utils/logger.ts";

// Add a property
export const addProperty = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      title,
      description,
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      area_sqft,
      property_type,
      amenities,
      images,
    } = req.body;

    if (
      !title ||
      !address ||
      !city ||
      !state ||
      !zip_code ||
      price === undefined ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      !property_type
    ) {
      return res.status(400).json({ message: "Missing property data" });
    }

    // ✅ Ultra-safe normalization for amenities
    let parsedAmenities: string[] = [];
    if (Array.isArray(amenities)) {
      parsedAmenities = amenities;
    } else if (typeof amenities === "string") {
      try {
        const temp = JSON.parse(amenities);
        parsedAmenities = Array.isArray(temp) ? temp : amenities.split(",").map(a => a.trim());
      } catch {
        parsedAmenities = amenities.split(",").map(a => a.trim());
      }
    }

    // ✅ Ultra-safe normalization for images
    let parsedImages: string[] = [];
    if (Array.isArray(images)) {
      parsedImages = images;
    } else if (typeof images === "string") {
      try {
        const temp = JSON.parse(images);
        parsedImages = Array.isArray(temp) ? temp : images.split(",").map(i => i.trim());
      } catch {
        parsedImages = images.split(",").map(i => i.trim());
      }
    }

    const [result]: any = await db.query(
      `
      INSERT INTO properties (
        owner_id, title, description, address, city, state, zip_code,
        price, bedrooms, bathrooms, area_sqft, property_type, amenities, images
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.userId,
        title,
        description || null,
        address,
        city,
        state,
        zip_code,
        price,
        bedrooms,
        bathrooms,
        area_sqft || null,
        property_type,
        JSON.stringify(parsedAmenities),
        JSON.stringify(parsedImages),
      ]
    );

    logger.info(`Property created by owner ${user.userId}`);

    res.status(201).json({
      message: "Property created successfully",
      propertyId: result.insertId,
    });
  } catch (error: any) {
    logger.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all available properties
export const getProperties = async (_req: Request, res: Response) => {
  try {
    const [rows]: any[] = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.address,
        p.city,
        p.state,
        p.zip_code,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.area_sqft,
        p.property_type,
        p.status,
        p.amenities,
        p.images,
        p.created_at,
        u.name  AS owner_name,
        u.email AS owner_email
      FROM properties p
      INNER JOIN users u ON p.owner_id = u.id
      WHERE p.status = 'AVAILABLE'
      ORDER BY p.created_at DESC
    `);

    const safeParse = (value: any) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    };

    const properties = rows.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      address: p.address,
      city: p.city,
      state: p.state,
      zip_code: p.zip_code,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area_sqft: p.area_sqft,
      property_type: p.property_type,
      status: p.status,
      amenities: safeParse(p.amenities),
      images: safeParse(p.images),
      created_at: p.created_at,
      owner: {
        name: p.owner_name,
        email: p.owner_email,
      },
    }));

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error: any) {
    logger.error(`Failed to fetch properties: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const [rows]: any[] = await db.query(
      `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.address,
        p.city,
        p.state,
        p.zip_code,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.area_sqft,
        p.property_type,
        p.status,
        p.amenities,
        p.images,
        p.created_at,
        u.name  AS owner_name,
        u.email AS owner_email
      FROM properties p
      INNER JOIN users u ON p.owner_id = u.id
      WHERE p.id = ? AND p.status = 'AVAILABLE'
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const safeParse = (value: any) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    };

    const p = rows[0];

    const property = {
      id: p.id,
      title: p.title,
      description: p.description,
      address: p.address,
      city: p.city,
      state: p.state,
      zip_code: p.zip_code,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area_sqft: p.area_sqft,
      property_type: p.property_type,
      status: p.status,
      amenities: safeParse(p.amenities),
      images: safeParse(p.images),
      created_at: p.created_at,
      owner: {
        name: p.owner_name,
        email: p.owner_email,
      },
    };

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    logger.error(`Failed to fetch property: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
    });
  }
};