import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import logger from "../utils/logger.js";

const dbPath = path.join(process.cwd(), "database.sqlite");

const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});

// Create tables if they don't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role TEXT CHECK(role IN ('TENANT', 'OWNER', 'ADMIN')) NOT NULL,
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    rent DECIMAL(10,2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    amenities TEXT,
    photos TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    tenant_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    request_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (tenant_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

logger.info("SQLite database connected and tables created");

export default db;