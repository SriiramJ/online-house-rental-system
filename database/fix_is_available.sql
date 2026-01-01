-- Migration script to remove is_available column
USE house_rental_db;

-- Check if is_available column exists and drop it
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE table_name='properties' 
     AND column_name='is_available' 
     AND table_schema=DATABASE()) > 0,
    'ALTER TABLE properties DROP COLUMN is_available',
    'SELECT "is_available column does not exist" as message'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the table structure
DESCRIBE properties;