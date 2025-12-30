import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

export interface TokenPayload {
  userId: number;
  role: string;
}

export const generateToken = (payload: TokenPayload, rememberMe: boolean = false): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: rememberMe ? '30d' : '1d', // Use string format for expiration
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  return decoded as TokenPayload;
};
