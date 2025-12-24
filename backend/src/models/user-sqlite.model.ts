import db from "../config/sqlite-db.js";
import logger from "../utils/logger.js";

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string,
  role: string,
  phone?: string
) => {
  logger.info(`Creating user: ${email}`);

  const result = await db.run(
    `INSERT INTO users (name, email, password_hash, role, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, passwordHash, role, phone || null]
  );

  return result.lastID;
};

export const findUserByEmail = async (email: string) => {
  logger.info(`Fetching user by email: ${email}`);

  const user = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );

  return user;
};