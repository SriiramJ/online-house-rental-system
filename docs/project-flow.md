# Project Flow - Online House Rental & Tenant Management System

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Responsibilities](#user-roles--responsibilities)
3. [Complete Application Flow](#complete-application-flow)
4. [Detailed Workflow by Feature](#detailed-workflow-by-feature)
5. [Database Flow](#database-flow)
6. [Authentication & Authorization Flow](#authentication--authorization-flow)
7. [Error Handling Flow](#error-handling-flow)

---

## System Overview

The Online House Rental & Tenant Management System is a full-stack web application that connects property owners with potential tenants. The system facilitates property listings, tenant searches, and booking management through a streamlined workflow.

**Technology Stack:**
- **Frontend:** Angular 18 + Angular Material
- **Backend:** Node.js + TypeScript + Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)

---

## User Roles & Responsibilities

### 1. **Tenant** (Primary User)
**Capabilities:**
- Register and login to the system
- Browse all available properties
- Search/filter properties by location, budget, and amenities
- View detailed property information
- Submit booking requests for properties
- View status of their booking requests (Pending/Approved/Rejected)
- View approved booking details

**Restrictions:**
- Cannot access owner dashboard
- Cannot modify property listings
- Cannot approve/reject bookings

### 2. **Owner** (Property Manager)
**Capabilities:**
- Register and login to the system
- Create, update, and delete property listings
- Upload property photos and details
- View all booking requests for their properties
- Approve or reject tenant booking requests
- View list of tenants with approved bookings
- Access owner dashboard with statistics

**Restrictions:**
- Cannot submit booking requests as a tenant
- Can only manage their own properties
- Cannot access other owners' properties

### 3. **Admin** (Optional - System Administrator)
**Capabilities:**
- View all users, properties, and bookings
- Access system-wide analytics
- Monitor system health and activity

**Note:** Admin implementation is optional for MVP

---

## Complete Application Flow

### High-Level System Flow

```
┌─────────────┐
│   Landing   │
│     Page    │
└──────┬──────┘
       │
       ├─────────────────┬──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Register  │   │    Login    │   │   Browse    │
│             │   │             │   │ Properties  │
└──────┬──────┘   └──────┬──────┘   │ (No Auth)   │
       │                 │           └─────────────┘
       └────────┬────────┘
                │
                ▼
         ┌─────────────┐
         │ Role Check  │
         └──────┬──────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌─────────────┐   ┌─────────────┐
│   Tenant    │   │    Owner    │
│  Dashboard  │   │  Dashboard  │
└─────────────┘   └─────────────┘
```

---

## Detailed Workflow by Feature

### 1. **User Registration & Authentication Flow**

```
User Opens App
    │
    ├─→ Clicks "Register"
    │       │
    │       ├─→ Fills Form (Name, Email, Password, Role, Phone)
    │       │
    │       ├─→ Frontend Validates Input
    │       │
    │       ├─→ Sends POST /api/auth/register
    │       │
    │       ├─→ Backend Validates Data
    │       │       │
    │       │       ├─→ Checks if email exists
    │       │       ├─→ Hashes password with bcrypt
    │       │       ├─→ Inserts user into database
    │       │       └─→ Returns success response
    │       │
    │       └─→ Redirects to Login Page
    │
    └─→ Clicks "Login"
            │
            ├─→ Enters Email & Password
            │
            ├─→ Sends POST /api/auth/login
            │
            ├─→ Backend Validates Credentials
            │       │
            │       ├─→ Finds user by email
            │       ├─→ Compares password hash
            │       ├─→ Generates JWT token
            │       └─→ Returns token + user data
            │
            ├─→ Frontend Stores JWT in localStorage/sessionStorage
            │
            └─→ Redirects based on role
                    │
                    ├─→ Tenant → /properties
                    └─→ Owner → /owner/dashboard
```

### 2. **Property Listing Flow (Owner)**

```
Owner Logs In
    │
    ▼
Owner Dashboard
    │
    ├─→ Clicks "Add New Property"
    │       │
    │       ├─→ Fills Property Form
    │       │   (Title, Description, Rent, Location, Amenities, Photos)
    │       │
    │       ├─→ Frontend Validates
    │       │   - Title not empty
    │       │   - Rent > 0
    │       │   - Location not empty
    │       │
    │       ├─→ Sends POST /api/properties
    │       │   Header: Authorization: Bearer <token>
    │       │
    │       ├─→ Backend Validates
    │       │       │
    │       │       ├─→ Verifies JWT token
    │       │       ├─→ Checks user role = Owner
    │       │       ├─→ Validates input data
    │       │       ├─→ Inserts into Properties table
    │       │       └─→ Returns created property
    │       │
    │       └─→ Shows Success Message
    │           Redirects to Property List
    │
    ├─→ Views "My Properties"
    │       │
    │       ├─→ Sends GET /api/owner/properties
    │       │
    │       └─→ Displays list with Edit/Delete options
    │
    ├─→ Clicks "Edit Property"
    │       │
    │       ├─→ Loads property data in form
    │       │
    │       ├─→ Updates fields
    │       │
    │       ├─→ Sends PUT /api/properties/:id
    │       │
    │       └─→ Backend verifies ownership & updates
    │
    └─→ Clicks "Delete Property"
            │
            ├─→ Shows confirmation dialog
            │
            ├─→ Sends DELETE /api/properties/:id
            │
            └─→ Backend verifies ownership & deletes
```

### 3. **Property Search & Browsing Flow (Tenant)**

```
Tenant/Guest Opens App
    │
    ▼
Property List Page (/properties)
    │
    ├─→ Sends GET /api/properties
    │       │
    │       └─→ Backend returns all properties
    │
    ├─→ Displays all properties in grid/list view
    │
    ├─→ Uses Search/Filter Options
    │       │
    │       ├─→ Location: "Chennai"
    │       ├─→ Budget: Min 5000 - Max 15000
    │       └─→ Amenities: [AC, WiFi, Parking]
    │
    ├─→ Sends GET /api/properties?location=Chennai&minRent=5000&maxRent=15000&amenities=AC,WiFi
    │
    ├─→ Backend filters properties based on query params
    │
    ├─→ Displays filtered results
    │
    └─→ Clicks on Property Card
            │
            ▼
    Property Details Page (/properties/:id)
            │
            ├─→ Sends GET /api/properties/:id
            │
            ├─→ Displays full details:
            │   - Photos carousel
            │   - Description
            │   - Rent amount
            │   - Location
            │   - Amenities list
            │   - Owner contact (if approved booking)
            │
            └─→ Shows "Book Now" button (if logged in as Tenant)
```

### 4. **Booking Request Flow (Tenant → Owner)**

```
Tenant on Property Details Page
    │
    ├─→ Clicks "Book Now" button
    │       │
    │       ├─→ Checks if user is logged in
    │       │   (Redirects to login if not)
    │       │
    │       ├─→ Checks user role = Tenant
    │       │   (Shows error if Owner tries to book)
    │       │
    │       └─→ Opens Booking Request Form
    │               │
    │               ├─→ Tenant fills additional info
    │               │   - Move-in date (optional)
    │               │   - Message to owner
    │               │   - Contact preferences
    │               │
    │               ├─→ Clicks "Submit Request"
    │               │
    │               ├─→ Sends POST /api/bookings
    │               │   Body: {
    │               │     property_id: 123,
    │               │     tenant_id: 456,
    │               │     message: "Interested in this property"
    │               │   }
    │               │
    │               ├─→ Backend Processing
    │               │       │
    │               │       ├─→ Verifies JWT token
    │               │       ├─→ Checks role = Tenant
    │               │       ├─→ Validates property exists
    │               │       ├─→ Checks for duplicate booking
    │               │       │   (Same tenant + property + Pending/Approved)
    │               │       ├─→ Creates booking with status = "Pending"
    │               │       └─→ Returns booking confirmation
    │               │
    │               └─→ Shows Success Message
    │                   "Booking request submitted successfully!"
    │
    ├─→ Tenant Views "My Bookings" (/tenant/bookings)
    │       │
    │       ├─→ Sends GET /api/bookings
    │       │
    │       ├─→ Backend returns tenant's bookings
    │       │
    │       └─→ Displays bookings grouped by status:
    │           - Pending (yellow badge)
    │           - Approved (green badge)
    │           - Rejected (red badge)
    │
    └─→ Owner Receives Notification (in dashboard)
```

### 5. **Booking Approval Flow (Owner)**

```
Owner Logs In
    │
    ▼
Owner Dashboard (/owner/dashboard)
    │
    ├─→ Sees "Pending Booking Requests" count (badge)
    │
    ├─→ Clicks "View Booking Requests"
    │       │
    │       ├─→ Sends GET /api/owner/bookings?status=Pending
    │       │
    │       ├─→ Backend returns bookings for owner's properties
    │       │
    │       └─→ Displays list with tenant details:
    │           - Tenant name
    │           - Property name
    │           - Request date
    │           - Message from tenant
    │           - Tenant contact
    │
    ├─→ Clicks on a Booking Request
    │       │
    │       ├─→ Views full booking details
    │       │
    │       └─→ Shows "Approve" and "Reject" buttons
    │
    ├─→ Owner Clicks "Approve"
    │       │
    │       ├─→ Sends PUT /api/bookings/:id/status
    │       │   Body: { status: "Approved" }
    │       │
    │       ├─→ Backend Processing
    │       │       │
    │       │       ├─→ Verifies JWT token
    │       │       ├─→ Checks user is property owner
    │       │       ├─→ Updates booking status to "Approved"
    │       │       ├─→ Records approval timestamp
    │       │       └─→ Returns success response
    │       │
    │       └─→ Shows Success Message
    │           "Booking approved successfully!"
    │
    ├─→ OR Owner Clicks "Reject"
    │       │
    │       ├─→ Shows optional reason dialog
    │       │
    │       ├─→ Sends PUT /api/bookings/:id/status
    │       │   Body: { status: "Rejected", reason: "..." }
    │       │
    │       └─→ Updates booking status to "Rejected"
    │
    └─→ Tenant sees updated status in "My Bookings"
```

### 6. **Tenant Management Flow (Owner)**

```
Owner Dashboard
    │
    └─→ Clicks "My Tenants" tab
            │
            ├─→ Sends GET /api/owner/tenants
            │
            ├─→ Backend returns list of tenants with approved bookings
            │
            └─→ Displays:
                - Tenant name
                - Property rented
                - Approval date
                - Contact information
                - Booking details
```

---

## Database Flow

### Entity Relationship & Data Flow

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users     │         │  Properties  │         │   Bookings   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │───┐     │ id (PK)      │───┐     │ id (PK)      │
│ name         │   │     │ owner_id(FK) │◄──┘     │ property_id  │◄──┐
│ email        │   │     │ title        │         │   (FK)       │   │
│ password_hash│   │     │ description  │         │ tenant_id    │◄──┼──┐
│ role         │   │     │ rent         │         │   (FK)       │   │  │
│ phone        │   │     │ location     │         │ status       │   │  │
│ created_at   │   │     │ amenities    │         │ request_time │   │  │
└──────────────┘   │     │ photos       │         └──────────────┘   │  │
                   │     │ created_at   │                            │  │
                   │     └──────────────┘                            │  │
                   │                                                 │  │
                   └─────────────────────────────────────────────────┘  │
                                                                        │
                                                                        │
                   ┌────────────────────────────────────────────────────┘
                   │
         Owner creates property
         Tenant requests booking
         Owner approves/rejects
```

### Database Operations Flow

**Property Creation:**
```sql
1. INSERT INTO properties (owner_id, title, description, rent, location, amenities, photos)
   VALUES (?, ?, ?, ?, ?, ?, ?)
```

**Booking Creation:**
```sql
2. INSERT INTO bookings (property_id, tenant_id, status, request_time)
   VALUES (?, ?, 'Pending', NOW())
```

**Booking Status Update:**
```sql
3. UPDATE bookings 
   SET status = ?, updated_at = NOW()
   WHERE id = ? AND property_id IN (
     SELECT id FROM properties WHERE owner_id = ?
   )
```

---

## Authentication & Authorization Flow

### JWT Token Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Authentication Flow                      │
└─────────────────────────────────────────────────────────────┘

1. User Login
   │
   ├─→ POST /api/auth/login
   │   Body: { email, password }
   │
   ├─→ Backend validates credentials
   │
   ├─→ Generates JWT token:
   │   Payload: {
   │     userId: 123,
   │     email: "user@example.com",
   │     role: "tenant",
   │     iat: timestamp,
   │     exp: timestamp + 24h
   │   }
   │
   ├─→ Signs token with SECRET_KEY
   │
   └─→ Returns: {
       success: true,
       token: "eyJhbGciOiJIUzI1NiIs...",
       user: { id, name, email, role }
     }

2. Subsequent API Requests
   │
   ├─→ Frontend includes token in header:
   │   Authorization: Bearer <token>
   │
   ├─→ Backend Middleware verifies token:
   │       │
   │       ├─→ Extracts token from header
   │       ├─→ Verifies signature
   │       ├─→ Checks expiration
   │       ├─→ Decodes payload
   │       └─→ Attaches user data to request
   │
   └─→ Route Handler processes request with user context
```

### Role-Based Access Control (RBAC)

```
Request → Auth Middleware → Role Check Middleware → Route Handler
            │                    │
            ├─ Verifies JWT      ├─ Checks user.role
            ├─ Decodes user      ├─ Compares with required roles
            └─ Attaches to req   └─ Allows/Denies access

Example:
- POST /api/properties
  → Must be authenticated (has valid token)
  → Must be Owner role
  
- POST /api/bookings
  → Must be authenticated
  → Must be Tenant role
  
- GET /api/properties
  → Public (no authentication required)
```

---

## Error Handling Flow

### Frontend Error Handling

```
API Call Made
    │
    ├─→ Success (200-299)
    │       │
    │       └─→ Process data
    │           Show success message
    │           Update UI
    │
    ├─→ Client Error (400-499)
    │       │
    │       ├─→ 400: Show validation errors
    │       ├─→ 401: Redirect to login
    │       ├─→ 403: Show "Access Denied"
    │       └─→ 404: Show "Not Found"
    │
    ├─→ Server Error (500-599)
    │       │
    │       └─→ Show generic error message
    │           Log error for debugging
    │
    └─→ Network Error
            │
            └─→ Show "Connection failed"
                Retry option
```

### Backend Error Handling

```
Route Handler
    │
    ├─→ try {
    │     Validate input
    │     Process business logic
    │     Database operations
    │     Return success response
    │   }
    │
    └─→ catch (error) {
          │
          ├─→ Validation Error
          │   → 400 Bad Request
          │
          ├─→ Authentication Error
          │   → 401 Unauthorized
          │
          ├─→ Authorization Error
          │   → 403 Forbidden
          │
          ├─→ Not Found Error
          │   → 404 Not Found
          │
          ├─→ Database Error
          │   → Log error
          │   → 500 Internal Server Error
          │
          └─→ Unknown Error
              → Log error
              → 500 Internal Server Error
        }
```

---

## Complete User Journey Examples

### Example 1: Tenant Books a Property

```
1. Tenant registers → Role: Tenant
2. Tenant logs in → Receives JWT token
3. Browses properties → GET /api/properties
4. Filters by location "Chennai" → GET /api/properties?location=Chennai
5. Clicks on property → GET /api/properties/123
6. Clicks "Book Now" → POST /api/bookings { property_id: 123 }
7. Booking created with status: Pending
8. Views "My Bookings" → Sees "Pending" status
9. Owner approves → Status changes to "Approved"
10. Tenant receives notification → Can now contact owner
```

### Example 2: Owner Lists and Rents Property

```
1. Owner registers → Role: Owner
2. Owner logs in → Redirected to dashboard
3. Clicks "Add Property" → Fills form
4. Submits → POST /api/properties
5. Property appears in "My Properties"
6. Tenant submits booking request
7. Owner sees notification in dashboard
8. Opens booking request → Views tenant details
9. Clicks "Approve" → PUT /api/bookings/456/status
10. Booking approved → Tenant notified
11. Owner can now view tenant in "My Tenants"
```

---

## Integration Points (Frontend ↔ Backend)

### Data Exchange Format

**All API responses follow this structure:**

```json
{
  "success": true/false,
  "data": { ... } or [...],
  "message": "Human readable message",
  "error": { "code": "ERROR_CODE", "message": "..." }
}
```

### Key Integration Checkpoints

1. **Authentication State Management**
   - Frontend stores JWT token
   - Includes token in all protected requests
   - Handles token expiration

2. **Role-Based UI Rendering**
   - Frontend checks user role from token/user object
   - Shows/hides components based on role
   - Angular guards prevent unauthorized route access

3. **Real-Time Status Updates**
   - Tenant sees booking status updates
   - Owner sees new booking request count
   - Consider polling or WebSockets for real-time updates

4. **Error Message Display**
   - Backend sends structured error messages
   - Frontend displays user-friendly messages
   - Validation errors shown near form fields

---

## Development Workflow

### Backend Development Phases

1. **Phase 1:** Database setup + User authentication
2. **Phase 2:** Property CRUD APIs
3. **Phase 3:** Booking system APIs
4. **Phase 4:** Owner dashboard APIs
5. **Phase 5:** Integration testing + Documentation

### Frontend Development Phases

1. **Phase 1:** Authentication components + Routing
2. **Phase 2:** Property listing + Details pages
3. **Phase 3:** Booking components
4. **Phase 4:** Owner dashboard
5. **Phase 5:** Integration with backend + Testing

---

## Notes & Best Practices

1. **Security:**
   - Never store passwords in plain text
   - Always validate and sanitize user input
   - Use parameterized queries to prevent SQL injection
   - Implement rate limiting on auth endpoints

2. **Performance:**
   - Add database indexes on frequently queried fields
   - Implement pagination for property listings
   - Cache frequently accessed data

3. **User Experience:**
   - Show loading indicators during API calls
   - Display meaningful error messages
   - Provide confirmation dialogs for destructive actions
   - Auto-refresh booking status

4. **Code Quality:**
   - Follow consistent naming conventions
   - Write reusable functions/components
   - Add comments for complex logic
   - Keep controllers thin, move logic to services

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Status:** Complete - Ready for Development