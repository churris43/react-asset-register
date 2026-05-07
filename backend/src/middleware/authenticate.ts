import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/AuthTypes";

// Extends Express's built-in Request type to include a user property.
// Using declare global makes req.user available across the entire project
// without needing to import anything extra in other files.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction, // NextFunction is the type for the next() callback that passes control to the next middleware or route handler
) => {
  const token = req.cookies.access_token;

  if (!token)
    return res.status(401).json({ message: "Authentication required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ["HS256"] }) as JwtPayload;

    // Reject refresh tokens — they are only valid at POST /auth/refresh,
    // not at protected API endpoints
    if (payload.type !== "access")
      return res.status(401).json({ message: "Invalid token type" });

    req.user = payload;
    next(); // token is valid — pass the request to the route handler
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
