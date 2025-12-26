export interface Property {
  id?: number;
  owner_id: number;
  title: string;
  description?: string;
  rent: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  property_type: 'APARTMENT' | 'HOUSE' | 'CONDO' | 'STUDIO';
  amenities?: string[];
  photos?: string[];
  is_available: boolean;
  created_at?: Date;
}

export interface CreatePropertyRequest {
  title: string;
  description?: string;
  rent: number;
  location: string;
  amenities?: string[];
  photos?: string[];
}