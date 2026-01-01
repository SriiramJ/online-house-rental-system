import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.ts"
dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'house_rental_db';
const dbPort = Number(process.env.DB_PORT) || 3306;

const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

// Test connection with better error handling
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    logger.info("MySQL database connected successfully");
    connection.release();
  } catch (err: any) {
    logger.error(`MySQL connection failed: ${err.message}`);
    logger.error(`Connection details: host=${dbHost}, user=${dbUser}, database=${dbName}, port=${dbPort}`);
    
    // Try connecting without database first
    try {
      const tempPool = mysql.createPool({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        port: dbPort
      });
      
      const tempConnection = await tempPool.getConnection();
      logger.info("MySQL server connection successful, but database might not exist");
      tempConnection.release();
      await tempPool.end();
    } catch (serverErr: any) {
      logger.error(`MySQL server connection also failed: ${serverErr.message}`);
    }
  }
};

testConnection();

export default db;