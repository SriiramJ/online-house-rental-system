import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.ts"
import { verifyToken } from "../utils/jwt.ts";

export const authMiddleware = (
    req: Request,
    res:Response,
    next: NextFunction
)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        logger.warn("Authorization header missing")
        return res.status(401).json({message: "Unauthorized"})
    }
    const token = authHeader.split(" ")[1]
    if(!token){
        logger.warn("Token not found in authorization header")
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
    } catch (error:any) {
        logger.error(`JWT verification failed: ${error.message}`)
        return res.status(401).json({message:"Invalid token"})
    }
}