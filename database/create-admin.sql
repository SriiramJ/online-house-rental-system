-- Insert Admin User (Password: Admin123!)
-- Use this SQL to create an admin user directly in the database

USE house_rental_db;

-- First ensure ADMIN role exists in enum
ALTER TABLE users MODIFY COLUMN role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL;

-- Generate proper password hash for Admin123!
-- Run this in Node.js: bcrypt.hashSync('Admin123!', 10)
INSERT INTO users (name, email, password_hash, role, phone, created_at) 
VALUES (
  'System Admin',
  'admin@rentease.com',
  '$2b$10$VniqHjr23/z.bD3QGrwkMOEgV1EmuLcfk/rtmuW/sziYgWdjL8Rxm',
  'ADMIN',
  '+1234567890',
  NOW()
);

-- Login credentials:
-- Email: admin@rentease.com
-- Password: Admin123!