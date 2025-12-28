-- Manual cleanup script for removing mock data
-- Run this in your MySQL client or phpMyAdmin

-- First, check what properties exist
SELECT id, title, location, owner_id FROM properties;

-- Delete mock properties (keep only Kala Arcade and Sree Homes)
-- You may need to adjust the WHERE clause based on the actual property IDs
DELETE FROM properties 
WHERE title NOT IN ('Kala Arcade', 'Sree Homes')
AND title NOT LIKE '%Kala%'
AND title NOT LIKE '%Sree%';

-- Alternative: Delete by specific titles if you know them
-- DELETE FROM properties WHERE title = 'Modern Downtown Apartment';
-- DELETE FROM properties WHERE title = 'Cozy Suburban House';
-- DELETE FROM properties WHERE title = 'Luxury Villa with Pool';

-- Clean up orphaned bookings
DELETE FROM bookings 
WHERE property_id NOT IN (SELECT id FROM properties);

-- Clean up orphaned tenants
DELETE FROM tenants 
WHERE property_id NOT IN (SELECT id FROM properties);

-- Verify the cleanup
SELECT id, title, location, owner_id, photos FROM properties;
SELECT COUNT(*) as remaining_properties FROM properties;