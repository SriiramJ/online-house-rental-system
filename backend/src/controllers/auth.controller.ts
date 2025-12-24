import type { Request, Response } from "express";
import logger from "../utils/logger.ts";
import { registerUserService, loginUserService  } from "../services/auth.service.ts";

export const register = async (req: Request, res: Response)=>{
    try{
        logger.info(`Registration request received: ${JSON.stringify(req.body)}`);
        await registerUserService(req.body)
        res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    }catch(error: any){
        logger.error(`Register failed: ${error.message}`);
        logger.error(`Full error:`, error);
        
        let userMessage = "Registration failed. Please try again.";
        if (error.message.includes("Email already registered")) {
            userMessage = "This email is already registered. Please use a different email.";
        } else if (error.message.includes("connection") || error.message.includes("database")) {
            userMessage = "Service temporarily unavailable. Please try again later.";
        }
        
        res.status(400).json({
            success: false,
            message: userMessage,
        })
    }
}

export const login = async (req: Request,res: Response)=>{
    try {
        const result = await loginUserService(
            req.body.email,
            req.body.password
        )
        res.status(200).json({
            success:true,
            message: "Login successful",
            data: result
        })
    } catch (error:any) {
        logger.error(`Login failed: ${error.message}`)
        
        let userMessage = "Login failed. Please check your credentials.";
        if (error.message.includes("User not found")) {
            userMessage = "No account found with this email address.";
        } else if (error.message.includes("Invalid password")) {
            userMessage = "Incorrect password. Please try again.";
        } else if (error.message.includes("connection") || error.message.includes("database")) {
            userMessage = "Service temporarily unavailable. Please try again later.";
        }
        
        res.status(401).json({
            success: false,
            message: userMessage,
        });
    }
}