import type { Request, Response } from "express";
import logger from "../utils/logger.ts";
import { getUserProfileService } from "../services/user.service.ts";

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await getUserProfileService(userId);
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error: any) {
        logger.error(`Get user profile failed: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // But we can log the logout event for security purposes
        const userId = (req as any).user.userId;
        logger.info(`User ${userId} logged out`);
        
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error: any) {
        logger.error(`Logout failed: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};