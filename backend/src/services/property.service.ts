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

      // Complete query with all columns
      const query = `INSERT INTO properties (
        owner_id, title, description, rent, location, 
        property_type, bedrooms, bathrooms, area_sqft, amenities, photos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        ownerId,
        propertyData.title,
        propertyData.description,
        parseFloat(propertyData.rent as any),
        propertyData.location,
        propertyData.propertyType || 'Apartment',
        parseInt(propertyData.bedrooms as any) || 1,
        parseInt(propertyData.bathrooms as any) || 1,
        parseInt(propertyData.area as any) || null,
        amenitiesText,
        photosText
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
        `SELECT p.*, u.name as owner_name,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Approved') as approved_bookings
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         ORDER BY p.created_at DESC`
      );

      const properties = rows as any[];
      if (properties.length === 0) {
        return [];
      }
      
      return properties.map(row => this.formatProperty(row));
    } catch (error: any) {
      logger.error(`Error fetching properties: ${error.message}`);
      return [];
    } finally {
      connection.release();
    }
  }

  async getPropertyById(id: number): Promise<Property> {
    const connection = await db.getConnection();
    
    try {
      const [rows] = await connection.execute(
        `SELECT p.*, u.name as owner_name,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Pending') as pending_requests,
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Approved') as approved_bookings
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
         (SELECT COUNT(*) FROM bookings b WHERE b.property_id = p.id AND b.status = 'Approved') as approved_bookings
         FROM properties p 
         JOIN users u ON p.owner_id = u.id 
         WHERE p.owner_id = ?
         ORDER BY p.created_at DESC`,
        [ownerId]
      );

      const properties = rows as any[];
      return properties.map(row => {
        const property = this.formatProperty(row);
        // Override is_available based on approved bookings
        if (row.approved_bookings > 0) {
          property.is_available = false;
        }
        return property;
      });
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
    // Determine availability based on approved bookings or database value
    let isAvailable = true;
    let status = 'Available';
    
    if (row.approved_bookings > 0) {
      isAvailable = false;
      status = 'Rented';
    } else if (row.pending_requests > 0) {
      status = 'Pending';
    } else if (row.is_available !== null && row.is_available !== undefined) {
      isAvailable = Boolean(row.is_available);
      status = isAvailable ? 'Available' : 'Rented';
    }
    
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
      is_available: isAvailable,
      status: status as 'Available' | 'Rented' | 'Pending',
      created_at: row.created_at,
      owner_name: row.owner_name,
      pending_requests: row.pending_requests || 0
    };
  }
}