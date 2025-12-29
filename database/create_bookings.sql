-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  tenant_id INT NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  move_in_date DATE NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample booking for testing
INSERT IGNORE INTO bookings (id, property_id, tenant_id, status, move_in_date, message) 
VALUES (1, 1, 2, 'Pending', '2024-12-25', 'Test booking message');