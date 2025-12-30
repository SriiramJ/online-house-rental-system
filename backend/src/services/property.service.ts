import db from "../config/db.ts";
import type { Property, CreatePropertyRequest } from "../models/property.model.ts";
import logger from "../utils/logger.ts";

export class PropertyService {
  private validatePropertyData(propertyData: CreatePropertyRequest): void {
    if (!propertyData.title || propertyData.title.trim().length < 3) {
      throw new Error('Property title must be at least 3 characters long');
    }
    
    if (!propertyData.description || propertyData.description.trim().length < 10) {
      throw new Error('Property description must be at least 10 characters long');
    }
    
    const rent = parseFloat(propertyData.rent as any);
    if (!rent || rent <= 0) {
      throw new Error('Rent must be a positive number');
    }
    
    if (!propertyData.location || propertyData.location.trim().length < 3) {
      throw new Error('Location must be at least 3 characters long');
    }
    
    const bedrooms = parseInt(propertyData.bedrooms as any);
    if (bedrooms < 1 || bedrooms > 10) {
      throw new Error('Bedrooms must be between 1 and 10');
    }
    
    const bathrooms = parseInt(propertyData.bathrooms as any);
    if (bathrooms < 1 || bathrooms > 10) {
      throw new Error('Bathrooms must be between 1 and 10');
    }
  }

  async createProperty(ownerId: number, propertyData: CreatePropertyRequest): Promise<Property> {
    try {
      this.validatePropertyData(propertyData);
      
      if (!ownerId || ownerId <= 0) {
        throw new Error('Invalid owner ID');
      }
      
      logger.info(`Creating property for owner ${ownerId}: ${propertyData.title}`);
      
      return await db.transaction(async (connection) => {
        const amenitiesText = propertyData.amenities && Array.isArray(propertyData.amenities) 
          ? propertyData.amenities.join(', ') 
          : null;
        const photosText = propertyData.photos && Array.isArray(propertyData.photos) 
          ? propertyData.photos.join(', ') 
          : null;

        const query = `INSERT INTO properties (
          owner_id, title, description, rent, location, 
          property_type, bedrooms, bathrooms, area_sqft, amenities, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
          ownerId,
          propertyData.title.trim(),
          propertyData.description.trim(),
          parseFloat(propertyData.rent as any),
          propertyData.location.trim(),
          propertyData.propertyType || 'Apartment',
          parseInt(propertyData.bedrooms as any) || 1,
          parseInt(propertyData.bathrooms as any) || 1,
          parseInt(propertyData.area as any) || null,
          amenitiesText,
          photosText
        ];

        const [result] = await connection.execute(query, values);
        const insertId = (result as any).insertId;
        
        logger.info(`Property created successfully with ID: ${insertId}`);
        return await this.getPropertyById(insertId);
      });
    } catch (error: any) {
      logger.error(`Error creating property: ${error.message}`);
      throw error;
    }
  }

  async getAllProperties(): Promise<Property[]> {
    try {
      const properties = await db.query(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.is_available = 1
         ORDER BY p.created_at DESC`
      );

      if (!properties || properties.length === 0) {
        return [];
      }
      
      return properties.map(this.formatProperty);
    } catch (error: any) {
      logger.error(`Error fetching properties: ${error.message}`);
      throw new Error('Failed to fetch properties');
    }
  }

  async getPropertyById(id: number): Promise<Property> {
    try {
      if (!id || id <= 0) {
        throw new Error('Invalid property ID');
      }
      
      const properties = await db.query(
        `SELECT p.*, u.name as owner_name 
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.id = ?`,
        [id]
      );

      if (!properties || properties.length === 0) {
        throw new Error('Property not found');
      }

      return this.formatProperty(properties[0]);
    } catch (error: any) {
      logger.error(`Error fetching property: ${error.message}`);
      throw error;
    }
  }

  async getOwnerProperties(ownerId: number): Promise<Property[]> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests
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

  async deleteOwnerProperty(propertyId: number, ownerId: number): Promise<boolean> {
    const connection = await db.getConnection();
    
    try {
      const [result] = await connection.execute(
        `DELETE FROM properties WHERE id = ? AND owner_id = ?`,
        [propertyId, ownerId]
      );

      return (result as any).affectedRows > 0;
    } catch (error: any) {
      logger.error(`Error deleting property: ${error.message}`);
      return false;
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
      area_sqft: row.area_sqft || null,
      amenities: row.amenities ? row.amenities.split(', ').filter(Boolean) : [],
      photos: row.photos ? row.photos.split(', ').filter(Boolean) : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
      is_available: row.is_available !== undefined ? Boolean(row.is_available) : true,
      created_at: row.created_at
    };
  }
}