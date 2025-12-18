import { createUser, findUserByEmail } from "../models/user.model.ts";
import { hashPassword, comparePassword } from "../utils/password.ts";
import { generateToken } from "../utils/jwt.ts";
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