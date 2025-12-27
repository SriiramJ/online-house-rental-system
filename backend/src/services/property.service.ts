import db from "../config/db.ts";
import type { Property, CreatePropertyRequest } from "../models/property.model.ts";
import logger from "../utils/logger.ts";

export class PropertyService {
  async createProperty(ownerId: number, propertyData: CreatePropertyRequest): Promise<Property> {
    const connection = await db.getConnection();
    
    try {
      const amenitiesText = propertyData.amenities && Array.isArray(propertyData.amenities) 
        ? propertyData.amenities.join(', ') 
        : null;
      const photosText = propertyData.photos && Array.isArray(propertyData.photos) 
        ? propertyData.photos.join(', ') 
        : null;

      // Map frontend field names to database fields
      const query = `INSERT INTO properties (
        owner_id, title, description, rent, location, 
        property_type, bedrooms, bathrooms, area_sqft,
        amenities, photos, is_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        ownerId,
        propertyData.title,
        propertyData.description,
        parseFloat(propertyData.rent as any),
        propertyData.location,
        propertyData.property_type || 'Apartment',
        parseInt(propertyData.bedrooms as any) || 1,
        parseFloat(propertyData.bathrooms as any) || 1,
        parseFloat(propertyData.area_sqft || propertyData.area as any) || null,
        amenitiesText,
        photosText,
        propertyData.available !== undefined ? propertyData.available : true
      ];

      const [result] = await connection.execute(query, values);
      const insertId = (result as any).insertId;
      return await this.getPropertyById(insertId);
    } catch (error: any) {
      logger.error(`Error creating property: ${error.message}`);
      throw new Error("Failed to create property");
    } finally {
      connection.release();
    }
  }

  async getAllProperties(): Promise<Property[]> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         ORDER BY p.created_at DESC`
      );

      const properties = rows as any[];
      if (properties.length === 0) {
        return []; // Return empty array instead of throwing error
      }
      
      return properties.map(this.formatProperty);
    } catch (error: any) {
      logger.error(`Error fetching properties: ${error.message}`);
      return []; // Return empty array on error
    } finally {
      connection.release();
    }
  }

  async getPropertyById(id: number): Promise<Property> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.id = ?`,
        [id]
      );

      const properties = rows as any[];
      if (properties.length === 0) {
        throw new Error("Property not found");
      }

      return this.formatProperty(properties[0]);
    } catch (error: any) {
      logger.error(`Error fetching property: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async getOwnerProperties(ownerId: number): Promise<Property[]> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests,
         (SELECT COUNT(*) FROM tenants t WHERE t.property_id = p.id AND t.status = 'Active') as active_tenants
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.owner_id = ?
         ORDER BY p.created_at DESC`,
        [ownerId]
      );

      const properties = rows as any[];
      return properties.map(this.formatProperty);
    } catch (error: any) {
      logger.error(`Error fetching owner properties: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  private formatProperty(row: any): Property {
    return {
      id: row.id,
      owner_id: row.owner_id,
      title: row.title,
      description: row.description,
      rent: parseFloat(row.rent),
      location: row.location,
      bedrooms: row.bedrooms || 1,
      bathrooms: row.bathrooms || 1,
      property_type: row.property_type || 'Apartment',
      area_sqft: row.area_sqft,
      amenities: row.amenities ? row.amenities.split(', ').filter(Boolean) : [],
      photos: row.photos ? row.photos.split(', ').filter(Boolean) : [],
      is_available: row.is_available !== undefined ? Boolean(row.is_available) : true,
      created_at: row.created_at
    };
  }
}