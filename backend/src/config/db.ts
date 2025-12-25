import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.ts"
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = Number(process.env.DB_PORT);

if (!dbHost || !dbUser || !dbName || !dbPort) {
  throw new Error('Missing environment variables');
}

const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword || '',
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
db.getConnection()
.then((connection) => {
  logger.info("MySQL database connected successfully");
  connection.release();
})
.catch((err) => {
  logger.error(`MySQL connection failed: ${err.message}`);
  logger.error(`Connection details: host=${dbHost}, user=${dbUser}, database=${dbName}, port=${dbPort}`);
})

export default db