import db from "../config/db.js";
import type { Property, CreatePropertyRequest } from "../models/property.model.js";
import logger from "../utils/logger.js";

export class PropertyService {
  private validatePropertyData(propertyData: CreatePropertyRequest): void {
    if (!propertyData.title?.trim()) {
      throw new Error("Property title is required");
    }

    if (!propertyData.description?.trim()) {
      throw new Error("Property description is required");
    }

    const rent = parseFloat(propertyData.rent as any);
    if (isNaN(rent) || rent <= 0) {
      throw new Error("Valid rent amount is required");
    }

    if (!propertyData.location?.trim()) {
      throw new Error("Location is required");
    }

    const bedrooms = parseInt(propertyData.bedrooms as any);
    if (isNaN(bedrooms) || bedrooms < 0) {
      throw new Error("Valid number of bedrooms is required");
    }

    const bathrooms = parseInt(propertyData.bathrooms as any);
    if (isNaN(bathrooms) || bathrooms < 1) {
      throw new Error("Valid number of bathrooms is required");
    }

    if (!propertyData.propertyType && !propertyData.property_type) {
      throw new Error("Property type is required");
    }
  }

  async createProperty(
    ownerId: number,
    propertyData: CreatePropertyRequest
  ): Promise<Property> {
    try {
      logger.info("=== PROPERTY SERVICE CREATE START ===");
      logger.info(`Owner ID: ${ownerId}`);
      logger.info(
        "Property data received:",
        JSON.stringify(propertyData, null, 2)
      );

      if (!ownerId || ownerId <= 0) {
        logger.error(`Invalid owner ID: ${ownerId}`);
        throw new Error("Invalid owner ID");
      }

      logger.info("Starting property data validation...");
      this.validatePropertyData(propertyData);
      logger.info("Property data validation passed");

      logger.info(
        `Creating property for owner ${ownerId}: ${propertyData.title}`
      );

      const amenitiesText =
        propertyData.amenities && Array.isArray(propertyData.amenities)
          ? propertyData.amenities.join(", ")
          : propertyData.amenities || null;
      const photosText =
        propertyData.photos && Array.isArray(propertyData.photos)
          ? propertyData.photos.join(", ")
          : propertyData.photos || null;

      const rent = parseFloat(propertyData.rent as any);
      const bedrooms = parseInt(propertyData.bedrooms as any) || 1;
      const bathrooms = parseInt(propertyData.bathrooms as any) || 1;
      const area_sqft = propertyData.area_sqft
        ? parseInt(propertyData.area_sqft as any)
        : propertyData.area
        ? parseInt(propertyData.area as any)
        : undefined;
      const propertyType =
        propertyData.propertyType || propertyData.property_type || "Apartment";
      const status: "Available" | "Pending" | "Rented" = "Available";

      logger.info("Processed values:", {
        rent,
        bedrooms,
        bathrooms,
        area_sqft,
        propertyType,
        status,
        amenitiesText,
        photosText,
      });

      const insertQuery = `INSERT INTO properties (
          owner_id, title, description, rent, location, 
          property_type, bedrooms, bathrooms, area_sqft, amenities, photos, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const insertValues = [
        ownerId,
        propertyData.title.trim(),
        propertyData.description.trim(),
        rent,
        propertyData.location.trim(),
        propertyType,
        bedrooms,
        bathrooms,
        area_sqft,
        amenitiesText,
        photosText,
        status,
      ];

      logger.info("SQL Query:", insertQuery);
      logger.info("SQL Values:", insertValues);

      logger.info("Executing database insert...");
      const result = await db.query(insertQuery, insertValues);

      const insertId = (result as any).insertId;
      logger.info(`Database insert result - insertId: ${insertId}`);

      if (!insertId) {
        logger.error("Failed to get property ID after creation");
        throw new Error("Failed to get property ID after creation");
      }

      const createdProperty = {
        id: insertId,
        owner_id: ownerId,
        title: propertyData.title,
        description: propertyData.description,
        rent: rent,
        location: propertyData.location,
        property_type: propertyType as any,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        area_sqft: area_sqft,
        amenities: propertyData.amenities || [],
        photos: propertyData.photos || [],
        status: status,
      };

      logger.info("Property created successfully:", createdProperty);
      logger.info("=== PROPERTY SERVICE CREATE SUCCESS ===");
      return createdProperty;
    } catch (error: any) {
      logger.error("=== PROPERTY SERVICE CREATE ERROR ===");
      logger.error(`Error creating property: ${error.message}`);
      logger.error("Error stack:", error.stack);
      logger.error("Error code:", error.code);
      logger.error("Error errno:", error.errno);
      logger.error("Error sqlMessage:", error.sqlMessage);
      logger.error("Error sqlState:", error.sqlState);
      throw error;
    }
  }

  async updateProperty(
    propertyId: number,
    ownerId: number,
    propertyData: CreatePropertyRequest
  ): Promise<Property> {
    try {
      if (!propertyId || propertyId <= 0) {
        throw new Error("Invalid property ID");
      }

      if (!ownerId || ownerId <= 0) {
        throw new Error("Invalid owner ID");
      }

      this.validatePropertyData(propertyData);

      logger.info(`Updating property ${propertyId} for owner ${ownerId}`);

      const amenitiesText =
        propertyData.amenities && Array.isArray(propertyData.amenities)
          ? propertyData.amenities.join(", ")
          : null;
      const photosText =
        propertyData.photos && Array.isArray(propertyData.photos)
          ? propertyData.photos.join(", ")
          : null;

      const rent = parseFloat(propertyData.rent as any);
      const bedrooms = parseInt(propertyData.bedrooms as any);
      const bathrooms = parseInt(propertyData.bathrooms as any);
      const area_sqft = propertyData.area_sqft
        ? parseInt(propertyData.area_sqft as any)
        : propertyData.area
        ? parseInt(propertyData.area as any)
        : undefined;
      const propertyType =
        propertyData.propertyType || propertyData.property_type || "Apartment";
      const status: "Available" | "Pending" | "Rented" = "Available";

      const result = await db.query(
        `UPDATE properties SET 
          title = ?, description = ?, rent = ?, location = ?, 
          property_type = ?, bedrooms = ?, bathrooms = ?, area_sqft = ?, 
          amenities = ?, photos = ?, status = ?
         WHERE id = ? AND owner_id = ?`,
        [
          propertyData.title.trim(),
          propertyData.description.trim(),
          rent,
          propertyData.location.trim(),
          propertyType,
          bedrooms,
          bathrooms,
          area_sqft,
          amenitiesText,
          photosText,
          status,
          propertyId,
          ownerId,
        ]
      );

      if ((result as any).affectedRows === 0) {
        throw new Error("Property not found or not owned by user");
      }

      logger.info(`Property ${propertyId} updated successfully`);

      return {
        id: propertyId,
        owner_id: ownerId,
        title: propertyData.title,
        description: propertyData.description,
        rent: rent,
        location: propertyData.location,
        property_type: propertyType as any,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        area_sqft: area_sqft,
        amenities: propertyData.amenities || [],
        photos: propertyData.photos || [],
        status: status,
      };
    } catch (error: any) {
      logger.error(`Error updating property: ${error.message}`);
      throw error;
    }
  }

  async getAllProperties(): Promise<Property[]> {
    try {
      const result = await db.query(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         ORDER BY p.created_at DESC`
      );

      const properties = Array.isArray(result) ? result : [];

      if (!properties || properties.length === 0) {
        return [];
      }

      return properties.map(this.formatProperty);
    } catch (error: any) {
      logger.error(`Error fetching properties: ${error.message}`);
      throw new Error("Failed to fetch properties");
    }
  }

  async getPropertyById(id: number): Promise<Property> {
    try {
      if (!id || id <= 0) {
        throw new Error("Invalid property ID");
      }

      const result = await db.query(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.id = ?`,
        [id]
      );

      const properties = Array.isArray(result) ? result : [];

      if (!properties || properties.length === 0) {
        throw new Error("Property not found");
      }

      return this.formatProperty(properties[0]);
    } catch (error: any) {
      logger.error(`Error fetching property: ${error.message}`);
      throw error;
    }
  }

  async getOwnerProperties(ownerId: number): Promise<Property[]> {
    try {
      if (!ownerId || ownerId <= 0) {
        throw new Error("Invalid owner ID");
      }

      logger.info(`Fetching properties for owner ID: ${ownerId}`);

      const result = await db.query(
        `SELECT p.*, u.name as owner_name,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests
         FROM properties p 
         JOIN users u ON p.owner_id = u.id
         WHERE p.owner_id = ?
         ORDER BY p.created_at DESC`,
        [ownerId]
      );

      const properties = Array.isArray(result) ? result : [];

      if (!properties || properties.length === 0) {
        return [];
      }

      return properties.map(this.formatProperty);
    } catch (error: any) {
      logger.error(`Error fetching owner properties: ${error.message}`);
      throw new Error("Failed to fetch owner properties");
    }
  }

  async deleteOwnerProperty(
    propertyId: number,
    ownerId: number
  ): Promise<boolean> {
    try {
      if (!propertyId || !ownerId) {
        throw new Error("Invalid property or owner ID");
      }

      const result = await db.query(
        `DELETE FROM properties WHERE id = ? AND owner_id = ?`,
        [propertyId, ownerId]
      );

      return (result as any).affectedRows > 0;
    } catch (error: any) {
      logger.error(`Error deleting property: ${error.message}`);
      throw error;
    }
  }

  private formatProperty(row: any): Property {
    const status = row.status || "Available";

    return {
      id: row.id,
      owner_id: row.owner_id,
      title: row.title,
      description: row.description,
      rent: parseFloat(row.rent),
      location: row.location,
      bedrooms: row.bedrooms || 1,
      bathrooms: row.bathrooms || 1,
      property_type: row.property_type || "Apartment",
      area_sqft: row.area_sqft || undefined,
      amenities: row.amenities ? row.amenities.split(", ").filter(Boolean) : [],
      photos: row.photos
        ? row.photos.split(", ").filter(Boolean)
        : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"],
      status: status,
      owner_name: row.owner_name,
      pending_requests: row.pending_requests || 0,
      created_at: row.created_at,
    } as Property;
  }
}
