# Property API Testing Guide

## Setup

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Import Postman Collection**
   - Import `backend/postman/Property_APIs.postman_collection.json` into Postman

## Test Scenarios

### 1. Authentication Setup
- **Register Owner**: Create an owner account
- **Login Owner**: Get JWT token (automatically saved to collection variable)

### 2. Property Management Tests

#### ✅ Create Property (Owner Only)
- **Method**: POST `/api/properties`
- **Auth**: Bearer Token Required
- **Role**: OWNER only
- **Expected**: 201 Created

#### ✅ Get All Properties
- **Method**: GET `/api/properties`
- **Auth**: None required (public)
- **Expected**: 200 OK with properties array

#### ✅ Get Property by ID
- **Method**: GET `/api/properties/:id`
- **Auth**: None required (public)
- **Expected**: 200 OK with property details

#### ❌ Invalid Request Handling
- **Create Property - Invalid Data**: Missing required fields → 400 Bad Request
- **Create Property - No Auth**: No token → 401 Unauthorized
- **Get Property - Invalid ID**: Non-existent ID → 404 Not Found

## Expected Responses

### Success Response (Create Property)
```json
{
  "message": "Property created successfully",
  "property": {
    "id": 1,
    "owner_id": 1,
    "title": "Modern Downtown Apartment",
    "description": "Beautiful modern apartment...",
    "rent": 2500,
    "location": "Downtown, City Center",
    "bedrooms": 2,
    "bathrooms": 2,
    "property_type": "APARTMENT",
    "amenities": ["WiFi", "Parking", "Gym", "Pool"],
    "photos": ["https://images.unsplash.com/..."],
    "is_available": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Success Response (Get Properties)
```json
{
  "message": "Properties fetched successfully",
  "properties": [...],
  "count": 5
}
```

### Error Response (Invalid Data)
```json
{
  "message": "Missing required fields: title, rent, location, bedrooms, bathrooms, property_type"
}
```

### Error Response (Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

### Error Response (Access Denied)
```json
{
  "message": "Access denied"
}
```

## Frontend Integration

The frontend properties page will:
- Fetch properties from `/api/properties`
- Display property grid with real data
- Show "No properties available" when empty
- Handle loading and error states

## Database Schema

Properties are stored with:
- Basic info (title, description, rent, location)
- Property details (bedrooms, bathrooms, type)
- JSON fields (amenities, photos)
- Owner relationship via foreign key
- Availability status