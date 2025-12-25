import type { Request, Response } from "express";
import db from "../config/db.ts";
import logger from "../utils/logger.ts";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const [rows]: any = await db.query(
            `SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC`
        );
        
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: rows
        });
    } catch (error: any) {
        logger.error(`Get users failed: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
};