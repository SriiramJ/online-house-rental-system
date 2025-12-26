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

      // Try with is_available first, fallback without it
      let query = `INSERT INTO properties (owner_id, title, description, rent, location, amenities, photos, is_available) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      let values = [
        ownerId,
        propertyData.title,
        propertyData.description || null,
        propertyData.rent,
        propertyData.location,
        amenitiesText,
        photosText,
        true
      ];

      try {
        const [result] = await connection.execute(query, values);
        const insertId = (result as any).insertId;
        return await this.getPropertyById(insertId);
      } catch (columnError: any) {
        if (columnError.message.includes('is_available')) {
          // Fallback without is_available column
          query = `INSERT INTO properties (owner_id, title, description, rent, location, amenities, photos) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
          values = values.slice(0, -1); // Remove is_available value
          
          const [result] = await connection.execute(query, values);
          const insertId = (result as any).insertId;
          return await this.getPropertyById(insertId);
        }
        throw columnError;
      }
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

  private formatProperty(row: any): Property {
    return {
      id: row.id,
      owner_id: row.owner_id,
      title: row.title,
      description: row.description,
      rent: parseFloat(row.rent),
      location: row.location,
      bedrooms: 1, // Default value since not in schema
      bathrooms: 1, // Default value since not in schema
      property_type: 'APARTMENT', // Default value since not in schema
      amenities: row.amenities ? row.amenities.split(', ').filter(Boolean) : [],
      photos: row.photos ? row.photos.split(', ').filter(Boolean) : [],
      is_available: row.is_available !== undefined ? Boolean(row.is_available) : true,
      created_at: row.created_at
    };
  }
}