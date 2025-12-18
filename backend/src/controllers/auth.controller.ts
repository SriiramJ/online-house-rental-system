import type { Request, Response } from "express";
import logger from "../utils/logger.ts";
import { registerUserService, loginUserService  } from "../services/auth.service.ts";

export const register = async (req: Request, res: Response)=>{
    try{
        await registerUserService(req.body)
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        })
    }catch(error: any){
        logger.error(`Register failed: ${error.message}`)
        res.status(400).json({
            success: false,
            message: error.message,
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
        res.status(401).json({
      success: false,
      message: error.message,
    });
    }
}