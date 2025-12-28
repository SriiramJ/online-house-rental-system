-- Update existing properties to use their uploaded photos
USE house_rental_db;

-- Set default photo for properties without photos
UPDATE properties 
SET photos = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
WHERE photos IS NULL OR photos = '';