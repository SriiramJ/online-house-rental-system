-- Create database schema for Online House Rental System

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL DEFAULT 'TENANT',
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    area_sqft INT,
    property_type ENUM('APARTMENT', 'HOUSE', 'CONDO', 'STUDIO') NOT NULL,
    status ENUM('AVAILABLE', 'RENTED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    images JSON,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    tenant_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2),
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);