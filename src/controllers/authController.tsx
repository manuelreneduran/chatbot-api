import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_ADMIN_SECRET || "your_secret_key";

// Dummy admin credentials for demonstration purposes
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";

export function adminLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  // Validate credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "24h" }); // Token expires in 1 hour
    return res.json({ token });
  }

  // Unauthorized if credentials are incorrect
  return res.status(401).json({ message: "Invalid credentials" });
}
