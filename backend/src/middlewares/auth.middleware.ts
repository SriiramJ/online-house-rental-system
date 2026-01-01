import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js"
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        logger.info('=== AUTH MIDDLEWARE START ===');
        logger.info('Request URL:', req.url);
        logger.info('Request method:', req.method);
        
        const authHeader = req.headers.authorization;
        logger.info('Authorization header:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("Authorization header missing or invalid format");
            logger.warn('Auth header value:', authHeader);
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
                code: "NO_TOKEN"
            });
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            logger.warn("Token not found in authorization header");
            return res.status(401).json({
                success: false,
                message: "Access denied. Invalid token format.",
                code: "INVALID_TOKEN_FORMAT"
            });
        }

        logger.info('Token found, verifying...');
        const decoded = verifyToken(token);
        logger.info('Token verified successfully:', { userId: decoded.userId, role: decoded.role });
        
        (req as any).user = decoded;
        logger.info('=== AUTH MIDDLEWARE SUCCESS ===');
        next();
    } catch (error: any) {
        logger.error('=== AUTH MIDDLEWARE ERROR ===');
        logger.error(`JWT verification failed: ${error.message}`);
        logger.error('Error details:', error);
        return res.status(401).json({
            success: false,
            message: "Access denied. Invalid or expired token.",
            code: "TOKEN_VERIFICATION_FAILED"
        });
    }
};