-- Active: 1765789481736@@127.0.0.1@3306@house_rental_db
USE house_rental_db;

-- USERS
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('Tenant User', 'tenant@test.com', '$2b$10$hashedpassword', 'TENANT', '9000000001'),
('Owner User', 'owner@test.com', '$2b$10$hashedpassword', 'OWNER', '9000000002'),
('Admin User', 'admin@test.com', '$2b$10$hashedpassword', 'ADMIN', '9000000003');

-- PROPERTIES (Owned by OWNER)
-- No mock properties - owners will add their own properties

-- BOOKINGS (Tenant books property)
-- No mock bookings - will be created when tenants book properties
