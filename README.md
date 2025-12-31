# 🏠 Online House Rental & Tenant Management System

A full-stack web application that connects **property owners** and **tenants**, enabling property listing, discovery, and an end-to-end **property booking workflow** with secure, role-based access.

This project is designed following real-world product architecture and was implemented using a **design-first approach (Figma → Code)** with a structured, day-wise development plan.

---

## 📌 Project Overview

The **Online House Rental & Tenant Management System** allows:

- **Tenants** to browse properties, request bookings, and track booking status  
- **Owners** to list properties, manage booking requests, and approve or reject tenants  
- **Admins (optional)** to view system-level analytics  

The system enforces **JWT-based authentication**, **role-based authorization**, and clean separation between frontend, backend, and database layers.

---

## 🧱 Tech Stack

### Frontend
- Angular 18
- Angular Material
- TypeScript
- Responsive, desktop-first UI

### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication
- bcrypt for password hashing

### Database
- MySQL

### Design & Workflow
- Figma (complete UI system)
- Feature-based Git branching
- RESTful API architecture

---

## 👥 User Roles & Capabilities

### Tenant
- Register & login
- Browse and filter properties
- View property details
- Submit booking requests
- Track booking status (Pending / Approved / Rejected)

### Owner
- Register & login
- Add, edit, and manage properties
- View booking requests for owned properties
- Approve or reject tenant bookings
- View approved tenants

### Admin (Optional)
- View users, properties, and bookings
- System-level analytics and monitoring

---

## 🔄 High-Level Application Flow

1. User lands on the **Landing Page**
2. User registers or logs in
3. JWT token is generated and stored
4. Role-based redirection occurs:
   - Tenant → Property Listing
   - Owner → Owner Dashboard
5. Tenant browses properties and submits booking request
6. Owner reviews and approves/rejects request
7. Tenant sees updated booking status

---

## 🗂️ Project Folder Structure

online-house-rental-system/
│
├── frontend/ # Angular application
│ ├── src/
│ │ ├── app/
│ │ │ ├── pages/ # Feature pages (landing, login, properties, etc.)
│ │ │ ├── core/ # Services, guards, interceptors
│ │ │ ├── shared/ # Reusable components & models
│ │ │ └── app-routing.module.ts
│ │ └── environments/
│ └── angular.json
│
├── backend/ # Node.js + Express API
│ ├── src/
│ │ ├── controllers/
│ │ ├── routes/
│ │ ├── middlewares/
│ │ ├── validators/
│ │ ├── config/
│ │ └── server.ts
│ └── package.json
│
├── database/
│ └── schema.sql # MySQL schema
│
├── docs/ # Documentation
│ ├── project-flow.md
│ ├── api-list.md
│ └── screenshots/
│
└── README.md


---

## 🧑‍💻 GitHub Workflow

- `main` → Stable, final code  
- `develop` → Integration branch  
- `feature/*` → Feature-specific branches  

### Rules
- No direct commits to `main`
- All changes go via Pull Requests to `develop`
- Feature-based branching (e.g., `feature/frontend-auth`, `feature/backend-booking-api`)

---

## 🗄️ Database Schema (Core Tables)

### Users
- id
- name
- email (unique)
- password_hash
- role (TENANT / OWNER / ADMIN)
- phone
- created_at

### Properties
- id
- owner_id
- title
- description
- rent
- location
- amenities
- photos
- created_at

### Bookings
- id
- property_id
- tenant_id
- status (Pending / Approved / Rejected)
- message
- request_time

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Tokens include:
  - userId
  - role
- Token expiry: 24 hours
- Middleware enforces:
  - Authenticated access
  - Role-based route protection

---

## 🏘️ Property Booking – End-to-End Flow

1. Tenant logs in and browses properties
2. Tenant views property details
3. Tenant submits a booking request
4. Backend validates request and stores booking with status `Pending`
5. Owner views pending booking requests
6. Owner approves or rejects the booking
7. Tenant sees updated booking status in **My Bookings**

This flow ensures:
- No duplicate bookings
- Owners manage only their properties
- Secure, role-based access throughout

---

## 🎨 UI & UX Principles

- Design-first development using Figma
- Angular Material components
- Role-aware UI rendering
- Snackbars for feedback
- Dialogs for confirmations
- Loading and empty states for all views

---

## 🧪 Error Handling

### Frontend
- Inline validation messages
- Snackbar notifications
- Redirects for unauthorized access
- Retry options for network failures

### Backend
- Proper HTTP status codes
- Centralized error handling
- Secure error messages
- Server-side logging

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
npm run dev
