import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.js";

interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check cookies first
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. If not in cookies, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7).trim(); // remove "Bearer "
      }
    }

    // 3. If still no token, reject
    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    // 4. Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    // 5. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    // 6. Find user in DB
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      res.status(401).json({ error: "Authentication failed" });
    }
  }
};

export { AuthRequest };