import { createUser, findUserByEmail, updateUserPassword } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js"
import crypto from "crypto";
import db from "../config/db.js";
import emailService from "./email.service.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "OWNER" | "ADMIN";
  phone?: string;
}

export const registerUserService = async (data: RegisterInput) => {
  try {
    if (!data.email || !data.password || !data.name || !data.role) {
      throw new Error('Missing required fields');
    }
    
    logger.info(`Register attempt for email: ${data.email}`);
    const existingUser = await findUserByEmail(data.email);
    
    if (existingUser) {
      logger.warn(`Email already exists: ${data.email}`);
      throw new Error("Email already registered");
    }

    const passwordHash = await hashPassword(data.password);

    const userId = await createUser(
      data.name.trim(),
      data.email.toLowerCase(),
      passwordHash,
      data.role,
      data.phone
    );
    
    logger.info(`User registered successfully: ${data.email}`);
    return userId;
  } catch (error: any) {
    logger.error(`Registration service error: ${error.message}`);
    throw error;
  }
};

export const loginUserService = async(email: string, password: string, rememberMe: boolean = false) => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        logger.info(`Login attempt for email: ${email}`);

        const user = await findUserByEmail(email.toLowerCase());

        if (!user) {
            logger.warn(`User not found: ${email}`);
            throw new Error("User not found");
        }

        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            logger.warn(`Invalid password for email: ${email}`);
            throw new Error("Invalid password");
        }

        const token = generateToken({
            userId: user.id,
            role: user.role
        }, rememberMe);
        
        logger.info(`Login successful for userId: ${user.id}, rememberMe: ${rememberMe}`);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error: any) {
        logger.error(`Login service error: ${error.message}`);
        throw error;
    }
};

export const forgotPasswordService = async (email: string) => {
    try {
        if (!email) {
            throw new Error('Email is required');
        }
        
        const user = await findUserByEmail(email.toLowerCase());
        if (!user) {
            throw new Error("User not found");
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        return await db.transaction(async (connection) => {
            // Delete any existing tokens for this user
            await connection.execute(
                'DELETE FROM password_reset_tokens WHERE user_id = ?',
                [user.id]
            );
            
            // Insert new token
            await connection.execute(
                'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
                [user.id, resetToken, expiresAt]
            );
            
            // Send email with reset link
            await emailService.sendPasswordResetEmail(email, resetToken);
            
            logger.info(`Password reset token generated and email sent for user: ${email}`);
            return resetToken;
        });
    } catch (error: any) {
        logger.error(`Forgot password service error: ${error.message}`);
        throw error;
    }
};

export const resetPasswordService = async (token: string, newPassword: string) => {
    try {
        if (!token || !newPassword) {
            throw new Error('Token and password are required');
        }
        
        return await db.transaction(async (connection) => {
            const [rows] = await connection.execute(
                'SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW() AND used = FALSE',
                [token]
            );
            
            const tokens = rows as any[];
            if (tokens.length === 0) {
                throw new Error("Invalid or expired token");
            }
            
            const userId = tokens[0].user_id;
            const hashedPassword = await hashPassword(newPassword);
            
            await connection.execute(
                'UPDATE users SET password_hash = ? WHERE id = ?',
                [hashedPassword, userId]
            );
            
            await connection.execute(
                'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
                [token]
            );
            
            logger.info(`Password reset successful for user ID: ${userId}`);
            return true;
        });
    } catch (error: any) {
        logger.error(`Reset password service error: ${error.message}`);
        throw error;
    }
};