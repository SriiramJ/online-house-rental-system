import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export const createUser = async (
  name: string,
  email: string,
  passwordHash: string,
  role: string,
  phone?: string
) => {
  logger.info(`Creating user: ${email}`);

  const [result]: any = await db.query(
    `INSERT INTO users (name, email, password_hash, role, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email, passwordHash, role, phone || null]
  );

  return result.insertId;
};

export const findUserByEmail = async (email: string) => {
  logger.info(`Fetching user by email: ${email}`);

  const [rows]: any = await db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );

  return rows[0];
};
