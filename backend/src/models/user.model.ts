import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string,
  role: string,
  phone?: string
) => {
  try {
    logger.info(`Creating user: ${email}`);

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, passwordHash, role, phone || null]
    );

    return result.insertId;
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    logger.info(`Fetching user by email: ${email}`);

    const rows = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    return rows && rows.length > 0 ? rows[0] : null;
  } catch (error: any) {
    logger.error(`Error finding user by email: ${error.message}`);
    throw error;
  }
};

export const updateUserPassword = async (userId: number, passwordHash: string) => {
  try {
    logger.info(`Updating password for user ID: ${userId}`);

    const result = await db.query(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [passwordHash, userId]
    );

    return result.affectedRows > 0;
  } catch (error: any) {
    logger.error(`Error updating user password: ${error.message}`);
    throw error;
  }
};
