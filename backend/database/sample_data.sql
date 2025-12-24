-- Insert sample users
INSERT INTO users (name, email, password_hash, role, phone) VALUES
('John Owner', 'owner@example.com', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'OWNER', '+1234567890'),
('Jane Tenant', 'tenant@example.com', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'TENANT', '+1234567891'),
('Admin User', 'admin@example.com', '$2b$10$rQZ8kHWiZ8kHWiZ8kHWiZOQZ8kHWiZ8kHWiZ8kHWiZ8kHWiZ8kHWi', 'ADMIN', '+1234567892');

-- Insert sample properties
INSERT INTO properties (owner_id, title, description, address, city, state, zip_code, price, bedrooms, bathrooms, area_sqft, property_type, status) VALUES
(2, 'Modern Downtown Apartment', 'Beautiful 2-bedroom apartment in the heart of downtown with city views', '123 Main St, Apt 4B', 'San Francisco', 'CA', '94102', 2500.00, 2, 2, 1200, 'APARTMENT', 'AVAILABLE'),
(2, 'Cozy Studio Near Campus', 'Perfect for students, walking distance to university', '456 College Ave', 'Berkeley', 'CA', '94704', 1800.00, 0, 1, 600, 'STUDIO', 'AVAILABLE'),
(2, 'Spacious Family House', 'Large 4-bedroom house with backyard, perfect for families', '789 Oak Street', 'Palo Alto', 'CA', '94301', 4500.00, 4, 3, 2500, 'HOUSE', 'AVAILABLE');