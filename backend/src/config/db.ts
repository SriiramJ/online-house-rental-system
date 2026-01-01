import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger.js";
dotenv.config();

class Database {
  private pool: mysql.Pool;
  private isConnected: boolean = false;

  constructor() {
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME;
    const dbPort = Number(process.env.DB_PORT);

    if (!dbHost || !dbUser || !dbName || !dbPort) {
      throw new Error('Missing required database environment variables');
    }

    this.pool = mysql.createPool({
      host: dbHost,
      user: dbUser,
      password: dbPassword || '',
      database: dbName,
      port: dbPort,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });

    this.initializeConnection();
  }

  private async initializeConnection() {
    try {
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      this.isConnected = true;
      logger.info("MySQL database connected successfully");
    } catch (error: any) {
      this.isConnected = false;
      logger.error(`MySQL connection failed: ${error.message}`);
      throw error;
    }
  }

  async getConnection(): Promise<mysql.PoolConnection> {
    try {
      if (!this.isConnected) {
        await this.initializeConnection();
      }
      return await this.pool.getConnection();
    } catch (error: any) {
      logger.error(`Failed to get database connection: ${error.message}`);
      throw new Error('Database connection unavailable');
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    const connection = await this.getConnection();
    try {
      const [results] = await connection.execute(sql, params);
      return results;
    } catch (error: any) {
      logger.error(`Database query failed: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error: any) {
      await connection.rollback();
      logger.error(`Transaction failed: ${error.message}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  async close(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info('Database connection closed');
    } catch (error: any) {
      logger.error(`Error closing database: ${error.message}`);
    }
  }
}

export default new Database();