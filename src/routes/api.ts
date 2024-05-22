import express from "express";
import {
  createChatHistory,
  getChatHistory,
} from "../controllers/chatHistoryController";
import { authenticateToken } from "../middleware/auth";
import { adminLogin } from "../controllers/authController";
import { deleteUserData } from "../controllers/adminController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

// Chat routes
router.post("/api/chat", createChatHistory);
router.get("/api/chat", getChatHistory);

// Admin routes
router.delete("/admin/deleteUserData", authenticateToken, deleteUserData);
router.post("/admin/login", adminLogin);

export default router;
