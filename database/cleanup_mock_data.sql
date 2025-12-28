-- Cleanup mock data and keep only user-added properties
USE house_rental_db;

-- Delete all properties except Kala Arcade and Sree Homes
DELETE FROM properties 
WHERE title NOT IN ('Kala Arcade', 'Sree Homes');

-- Clean up any orphaned bookings
DELETE FROM bookings 
WHERE property_id NOT IN (SELECT id FROM properties);

-- Clean up any orphaned tenants
DELETE FROM tenants 
WHERE property_id NOT IN (SELECT id FROM properties);

-- Show remaining properties
SELECT id, title, location, owner_id, photos FROM properties;