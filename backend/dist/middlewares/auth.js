import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authenticateToken = async (req, res, next) => {
    try {
        let token;
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.slice(7).trim();
            }
        }
        if (!token) {
            res.status(401).json({ error: "Access token required" });
            return;
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not defined in environment variables");
            res.status(500).json({ error: "Server configuration error" });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ error: "User not found" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ error: "Token expired" });
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: "Invalid token" });
        }
        else {
            res.status(401).json({ error: "Authentication failed" });
        }
    }
};
//# sourceMappingURL=auth.js.map