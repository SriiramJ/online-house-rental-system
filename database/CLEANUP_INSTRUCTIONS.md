## Database Cleanup Instructions

### Step 1: Connect to MySQL
```bash
mysql -u root -p
```

### Step 2: Use the correct database
```sql
USE house_rental_db;
```

### Step 3: Check current properties
```sql
SELECT id, title, location, owner_id, photos FROM properties;
```

### Step 4: Identify and delete mock properties
Based on the screenshots, you want to keep only:
- Kala Arcade (Hyderabad)
- Sree Homes (Hyderabad)

Delete the mock properties:
```sql
-- Delete specific mock properties by title
DELETE FROM properties WHERE title = 'Modern Downtown Apartment';
DELETE FROM properties WHERE title = 'Cozy Suburban House';  
DELETE FROM properties WHERE title = 'Luxury Villa with Pool';

-- Or delete all properties NOT matching your real ones
DELETE FROM properties 
WHERE title NOT IN ('Kala Arcade', 'Sree Homes')
AND location NOT LIKE '%Hyderabad%';
```

### Step 5: Clean up related data
```sql
-- Clean up orphaned bookings
DELETE FROM bookings 
WHERE property_id NOT IN (SELECT id FROM properties);

-- Clean up orphaned tenants
DELETE FROM tenants 
WHERE property_id NOT IN (SELECT id FROM properties);
```

### Step 6: Verify cleanup
```sql
SELECT id, title, location, owner_id, photos FROM properties;
SELECT COUNT(*) as total_properties FROM properties;
```

### Alternative: If you want to start fresh
If you want to completely reset and only keep your user data:
```sql
-- Keep only user accounts, delete all properties
DELETE FROM tenants;
DELETE FROM bookings;
DELETE FROM properties;

-- Then add your properties again using the frontend form
```

### After cleanup, restart your backend server
```bash
cd backend
npm run dev
```

The frontend image display issue has been fixed in the code. Your uploaded images should now display properly in both the Browse Properties and My Properties pages.