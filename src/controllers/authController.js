"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_ADMIN_SECRET || "your_secret_key";
// Dummy admin credentials for demonstration purposes
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
function adminLogin(req, res) {
    const { username, password } = req.body;
    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jsonwebtoken_1.default.sign({ username }, secretKey, { expiresIn: "24h" }); // Token expires in 1 hour
        return res.json({ token });
    }
    // Unauthorized if credentials are incorrect
    return res.status(401).json({ message: "Invalid credentials" });
}
exports.adminLogin = adminLogin;
