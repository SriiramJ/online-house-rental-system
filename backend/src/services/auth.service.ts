import { createUser, findUserByEmail, updateUserPassword } from "../models/user.model.ts";
import { hashPassword, comparePassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
import { sendPasswordResetEmail } from "../utils/email.ts";
import db from "../config/db.ts";
import crypto from "crypto";
import logger from "../utils/logger.ts"
interface RegisterInput{
  name: string;
  email: string;
  password: string;
  role: "TENANT" | "OWNER" | "ADMIN";
  phone?: string;
}

export const registerUserService = async (data: RegisterInput)=>{
    logger.info(`Register attempt for email: ${data.email}`);
    const existingUser = await findUserByEmail(data.email)
    if (existingUser){
        logger.warn(`Email already exists: ${data.email}`);
        throw new Error("Email already registered")
    }

    const passwordHash = await hashPassword(data.password)

    const userId = await createUser(
        data.name,
        data.email,
        passwordHash,
        data.role,
        data.phone
    )
    logger.info(`User registered successfully: ${data.email}`)
    return userId
}

export const loginUserService = async(email:string, password:string)=>{
    logger.info(`Login attempt for email: ${email}`);

    const user = await findUserByEmail(email)

    if(!user){
        logger.warn(`User not found: ${email}`);
        throw new Error("User not found")
    }

    const isValid = await comparePassword(password, user.password_hash)

    if(!isValid){
        logger.warn(`Invalid password for email: ${email}`);
        throw new Error("Invalid password")
    }

    const token = generateToken({
        userId: user.id,
        role: user.role
    })
    logger.info(`Login successful for userId: ${user.id}`);
    return{
        token,
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }
}

export const forgotPasswordService = async (email: string) => {
    logger.info(`Forgot password request for email: ${email}`);
    
    const user = await findUserByEmail(email);
    if (!user) {
        logger.warn(`User not found for forgot password: ${email}`);
        // Don't reveal if email exists or not for security
        return;
    }
    
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
    
    const connection = await db.getConnection();
    try {
        // Create table if it doesn't exist
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS password_reset_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) NOT NULL UNIQUE,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_reset_token_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE
            )
        `);
        
        // Delete any existing tokens for this user
        await connection.execute(
            'DELETE FROM password_reset_tokens WHERE user_id = ?',
            [user.id]
        );
        
        // Insert new token
        await connection.execute(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, token, expiresAt]
        );
        
        // Send email
        await sendPasswordResetEmail(user.email, user.name, token);
        
        logger.info(`Password reset email sent to: ${email}`);
    } finally {
        connection.release();
    }
};

export const resetPasswordService = async (token: string, newPassword: string) => {
    logger.info(`Password reset attempt with token: ${token.substring(0, 8)}...`);
    
    const connection = await db.getConnection();
    try {
        // Find valid token
        const [rows] = await connection.execute(
            'SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW() AND used = FALSE',
            [token]
        );
        
        const tokenData = rows as any[];
        if (tokenData.length === 0) {
            throw new Error('Invalid or expired token');
        }
        
        const userId = tokenData[0].user_id;
        
        // Hash new password
        const passwordHash = await hashPassword(newPassword);
        
        // Update password
        await updateUserPassword(userId, passwordHash);
        
        // Mark token as used
        await connection.execute(
            'UPDATE password_reset_tokens SET used = TRUE WHERE token = ?',
            [token]
        );
        
        logger.info(`Password reset successful for userId: ${userId}`);
    } finally {
        connection.release();
    }
};