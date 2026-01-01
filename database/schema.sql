-- =====================================================
-- HOUSE RENTAL SYSTEM - COMPLETE DATABASE SCHEMA
-- =====================================================

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS house_rental_db;
USE house_rental_db;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL,
  phone VARCHAR(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  rent DECIMAL(10,2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  property_type ENUM('Apartment', 'House', 'Condo', 'Studio') DEFAULT 'Apartment',
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  area_sqft INT,
  amenities TEXT,
  photos TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_properties_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Add is_available column if it doesn't exist (for existing databases)
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='is_available' AND table_schema='house_rental_db') > 0,
    'SELECT "is_available column already exists"',
    'ALTER TABLE properties ADD COLUMN is_available BOOLEAN DEFAULT TRUE'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  move_in_date DATE,
  lease_duration VARCHAR(50),
  message TEXT,
  rejection_reason TEXT,
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_bookings_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_bookings_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Add missing columns to bookings table if they don't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='bookings' AND column_name='move_in_date' AND table_schema='house_rental_db') > 0,
    'SELECT "move_in_date column already exists"',
    'ALTER TABLE bookings ADD COLUMN move_in_date DATE'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='bookings' AND column_name='rejection_reason' AND table_schema='house_rental_db') > 0,
    'SELECT "rejection_reason column already exists"',
    'ALTER TABLE bookings ADD COLUMN rejection_reason TEXT'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='bookings' AND column_name='message' AND table_schema='house_rental_db') > 0,
    'SELECT "message column already exists"',
    'ALTER TABLE bookings ADD COLUMN message TEXT'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- TENANTS TABLE
-- =====================================================
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

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
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

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================
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

-- Show completion message
SELECT 'Database schema created successfully!' as status;
SHOW TABLES;