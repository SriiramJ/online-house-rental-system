USE house_rental_db;

-- Add missing columns to properties table
ALTER TABLE properties ADD COLUMN property_type ENUM('Apartment', 'House', 'Condo', 'Studio') DEFAULT 'Apartment';
ALTER TABLE properties ADD COLUMN bedrooms INT DEFAULT 1;
ALTER TABLE properties ADD COLUMN bathrooms INT DEFAULT 1;
ALTER TABLE properties ADD COLUMN area_sqft INT;
ALTER TABLE properties ADD COLUMN amenities TEXT;
ALTER TABLE properties ADD COLUMN photos TEXT;
ALTER TABLE properties ADD COLUMN is_available BOOLEAN DEFAULT TRUE;

-- Create tenants table
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

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create activity_logs table if not exists
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

SELECT 'Database structure updated successfully' as status;