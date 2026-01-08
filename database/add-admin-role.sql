-- Migration to add ADMIN role and create admin user
USE house_rental_db;

-- Add ADMIN to the role enum if it doesn't exist
ALTER TABLE users MODIFY COLUMN role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL;

-- Delete existing admin user if exists
DELETE FROM users WHERE email = 'admin@rentease.com';

-- Insert admin user with correct password hash
INSERT INTO users (name, email, password_hash, role, phone, created_at) 
VALUES (
  'System Admin',
  'admin@rentease.com',
  '$2b$10$VniqHjr23/z.bD3QGrwkMOEgV1EmuLcfk/rtmuW/sziYgWdjL8Rxm',
  'ADMIN',
  '+1234567890',
  NOW()
);

-- Verify the admin user was created
SELECT id, name, email, role FROM users WHERE email = 'admin@rentease.com';

-- Login credentials:
-- Email: admin@rentease.com
-- Password: Admin123!