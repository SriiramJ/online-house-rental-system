USE house_rental_db;

-- Insert test users for demo purposes
-- Password for all test users is 'Test@123' (hashed)
INSERT INTO users (name, email, password_hash, role, phone, created_at) VALUES
('Test Tenant', 'tenant@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TENANT', '1234567890', NOW()),
('Test Owner', 'owner@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'OWNER', '0987654321', NOW());

-- Insert sample properties
INSERT INTO properties (owner_id, title, description, rent, location, property_type, bedrooms, bathrooms, area_sqft, amenities, photos, status, created_at) VALUES
(2, 'Modern Downtown Apartment', 'Beautiful modern apartment in the heart of downtown with stunning city views', 1200.00, 'Downtown, City Center', 'Apartment', 2, 1, 850, 'WiFi, Parking, Gym, Pool', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400', 'Available', NOW()),
(2, 'Cozy Studio Near University', 'Perfect studio apartment for students, walking distance to campus', 800.00, 'University District', 'Studio', 1, 1, 450, 'WiFi, Laundry, Study Area', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', 'Available', NOW()),
(2, 'Spacious Family House', 'Large family home with garden, perfect for families with children', 2000.00, 'Suburban Area', 'House', 4, 3, 2200, 'Garden, Garage, WiFi, Playground', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400', 'Available', NOW());