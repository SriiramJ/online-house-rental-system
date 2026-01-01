import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const setupDatabase = async () => {
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'house_rental_db';
  const dbPort = Number(process.env.DB_PORT) || 3306;

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      port: dbPort
    });

    console.log('Connected to MySQL server');

    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database ${dbName} created or already exists`);

    await connection.execute(`USE ${dbName}`);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('TENANT', 'OWNER', 'ADMIN') NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Users table created');
    await connection.end();
    console.log('Database setup completed successfully!');

  } catch (error: any) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();