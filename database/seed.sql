-- Active: 1765789481736@@127.0.0.1@3306@house_rental_db
USE house_rental_db;

-- USERS
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('Tenant User', 'tenant@test.com', '$2b$10$hashedpassword', 'TENANT', '9000000001'),
('Owner User', 'owner@test.com', '$2b$10$hashedpassword', 'OWNER', '9000000002'),
('Admin User', 'admin@test.com', '$2b$10$hashedpassword', 'ADMIN', '9000000003');

-- PROPERTIES (Owned by OWNER)
INSERT INTO properties (owner_id, title, description, rent, location, amenities)
VALUES
(2, '2BHK Apartment', 'Near metro station', 15000, 'Chennai', 'AC,WiFi,Parking'),
(2, '1BHK Studio', 'Ideal for bachelors', 9000, 'Bangalore', 'WiFi');

-- BOOKINGS (Tenant books property)
INSERT INTO bookings (property_id, tenant_id, status)
VALUES
(1, 1, 'Pending'),
(2, 1, 'Approved');
