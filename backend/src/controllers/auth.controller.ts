import type { Request, Response } from "express";
import logger from "../utils/logger.ts";
import { registerUserService, loginUserService, forgotPasswordService, resetPasswordService } from "../services/auth.service.ts";

// Input validation schemas
const validateEmail = (email: string): boolean => {
    return email && email.endsWith('@gmail.com') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return password && passwordRegex.test(password);
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone } = req.body;
        
        // Input validation
        if (!name || name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Name must be at least 2 characters long",
                code: "INVALID_NAME"
            });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Only valid Gmail addresses (@gmail.com) are accepted",
                code: "INVALID_EMAIL"
            });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters with uppercase, lowercase, and special character",
                code: "INVALID_PASSWORD"
            });
        }
        
        if (!['TENANT', 'OWNER'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Role must be either TENANT or OWNER",
                code: "INVALID_ROLE"
            });
        }
        
        if (phone && !/^[0-9]{10}$/.test(phone.replace(/[^0-9]/g, ''))) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits",
                code: "INVALID_PHONE"
            });
        }
        
        logger.info(`Registration request received for email: ${email}`);
        const userId = await registerUserService({ name: name.trim(), email: email.toLowerCase(), password, role, phone });
        
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: { userId }
        });
    } catch (error: any) {
        logger.error(`Register failed: ${error.message}`);
        
        let statusCode = 500;
        let message = "Registration failed. Please try again.";
        let code = "REGISTRATION_ERROR";
        
        if (error.message.includes("Email already registered")) {
            statusCode = 409;
            message = "This email is already registered. Please use a different email.";
            code = "EMAIL_EXISTS";
        } else if (error.message.includes("connection") || error.message.includes("database")) {
            statusCode = 503;
            message = "Service temporarily unavailable. Please try again later.";
            code = "SERVICE_UNAVAILABLE";
        }
        
        res.status(statusCode).json({
            success: false,
            message,
            code
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, rememberMe } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
                code: "MISSING_CREDENTIALS"
            });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid Gmail address",
                code: "INVALID_EMAIL"
            });
        }
        
        logger.info(`Login attempt for email: ${email}`);
        const result = await loginUserService(email.toLowerCase(), password, rememberMe || false);
        
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error: any) {
        logger.error(`Login failed: ${error.message}`);
        
        let statusCode = 401;
        let message = "Login failed. Please check your credentials.";
        let code = "LOGIN_FAILED";
        
        if (error.message.includes("User not found")) {
            message = "No account found with this email address.";
            code = "USER_NOT_FOUND";
        } else if (error.message.includes("Invalid password")) {
            message = "Incorrect password. Please try again.";
            code = "INVALID_PASSWORD";
        } else if (error.message.includes("connection") || error.message.includes("database")) {
            statusCode = 503;
            message = "Service temporarily unavailable. Please try again later.";
            code = "SERVICE_UNAVAILABLE";
        }
        
        res.status(statusCode).json({
            success: false,
            message,
            code
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
                code: "MISSING_EMAIL"
            });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid Gmail address",
                code: "INVALID_EMAIL"
            });
        }
        
        logger.info(`Forgot password request for email: ${email}`);
        await forgotPasswordService(email.toLowerCase());
        
        res.status(200).json({
            success: true,
            message: "Password reset instructions sent to your email"
        });
    } catch (error: any) {
        logger.error(`Forgot password failed: ${error.message}`);
        
        // Don't reveal if user exists or not for security
        res.status(200).json({
            success: true,
            message: "If an account exists with this email, password reset instructions have been sent"
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and password are required",
                code: "MISSING_FIELDS"
            });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters with uppercase, lowercase, and special character",
                code: "INVALID_PASSWORD"
            });
        }
        
        logger.info(`Password reset attempt with token: ${token.substring(0, 10)}...`);
        await resetPasswordService(token, password);
        
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error: any) {
        logger.error(`Reset password failed: ${error.message}`);
        
        let statusCode = 400;
        let message = "Password reset failed";
        let code = "RESET_FAILED";
        
        if (error.message.includes("Invalid or expired token")) {
            message = "Reset link is invalid or has expired. Please request a new one.";
            code = "INVALID_TOKEN";
        }
        
        res.status(statusCode).json({
            success: false,
            message,
            code
        });
    }
};