import pool from "../config/db.ts";
import logger from "../utils/logger.ts";

export const getUserProfileService = async (userId: number) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        const users = rows as any[];
        if (users.length === 0) {
            throw new Error('User not found');
        }
        
        return users[0];
    } catch (error: any) {
        logger.error(`Database error in getUserProfileService: ${error.message}`);
        throw error;
    }
};