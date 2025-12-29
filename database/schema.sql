-- =====================================================
-- HOUSE RENTAL DATABASE SCHEMA - COMPLETE
-- =====================================================
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add missing columns to existing properties table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='property_type' AND table_schema='house_rental_db') > 0,
    'SELECT "property_type column exists"',
    'ALTER TABLE properties ADD COLUMN property_type ENUM("Apartment", "House", "Condo", "Studio") DEFAULT "Apartment"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='bedrooms' AND table_schema='house_rental_db') > 0,
    'SELECT "bedrooms column exists"',
    'ALTER TABLE properties ADD COLUMN bedrooms INT DEFAULT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='bathrooms' AND table_schema='house_rental_db') > 0,
    'SELECT "bathrooms column exists"',
    'ALTER TABLE properties ADD COLUMN bathrooms INT DEFAULT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='area_sqft' AND table_schema='house_rental_db') > 0,
    'SELECT "area_sqft column exists"',
    'ALTER TABLE properties ADD COLUMN area_sqft INT'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='amenities' AND table_schema='house_rental_db') > 0,
    'SELECT "amenities column exists"',
    'ALTER TABLE properties ADD COLUMN amenities TEXT'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='photos' AND table_schema='house_rental_db') > 0,
    'SELECT "photos column exists"',
    'ALTER TABLE properties ADD COLUMN photos TEXT'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='properties' AND column_name='is_available' AND table_schema='house_rental_db') > 0,
    'SELECT "is_available column exists"',
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
  request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add missing columns to existing bookings table
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name='bookings' AND column_name='created_at' AND table_schema='house_rental_db') > 0,
    'SELECT "created_at column exists"',
    'ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
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

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
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

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);