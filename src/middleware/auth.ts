import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const secretKey: Secret = process.env.JWT_ADMIN_SECRET || ""; // Use a secret key from your environment variables

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  jwt.verify(token, secretKey, (err: any) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    next(); // Proceed to the next middleware or route handler
  });
}
