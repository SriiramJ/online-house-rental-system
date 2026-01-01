export interface Property {
  id?: number;
  owner_id: number;
  title: string;
  description?: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  area_sqft?: number;
  amenities?: string[];
  photos?: string[];
  is_available: boolean;
  status: 'Available' | 'Rented' | 'Pending';
  created_at?: Date;
  owner_name?: string;
  pending_requests?: number;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  rent: number | string;
  location: string;
  bedrooms: number | string;
  bathrooms: number | string;
  area?: number | string;
  area_sqft?: number;
  property_type?: string;
  propertyType?: string; // Frontend field name
  amenities?: string[];
  photos?: string[];
  available?: boolean;
  is_available?: boolean; // Database field name
}