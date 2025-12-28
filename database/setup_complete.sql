-- Complete database setup and fix script
-- Run this to ensure all tables and columns exist

USE house_rental_db;

-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create properties table if not exists
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rent DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_properties_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Add missing columns to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS property_type ENUM('Apartment', 'House', 'Condo', 'Studio') DEFAULT 'Apartment' 
AFTER location;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS bedrooms INT DEFAULT 1 
AFTER property_type;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS bathrooms INT DEFAULT 1 
AFTER bedrooms;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS area_sqft INT 
AFTER bathrooms;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS amenities TEXT 
AFTER area_sqft;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS photos TEXT 
AFTER amenities;

ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT TRUE 
AFTER photos;

-- Create bookings table if not exists
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  move_in_date DATE,
  lease_duration VARCHAR(50),
  message TEXT,
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_bookings_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bookings_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Create tenants table if not exists
CREATE TABLE IF NOT EXISTS tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  lease_start DATE NOT NULL,
  lease_end DATE NOT NULL,
  monthly_rent DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2),
  status ENUM('Active', 'Expired', 'Terminated') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_tenants_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tenants_user
    FOREIGN KEY (tenant_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Create activity_logs table if not exists
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_activity_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

-- Show all table structures
SELECT 'Tables created successfully' as status;
SHOW TABLES;