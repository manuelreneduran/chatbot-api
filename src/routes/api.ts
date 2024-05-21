import express from "express";
import { handleUserChatRequest } from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";
import { adminLogin } from "../controllers/authController";
import { deleteUserData } from "../controllers/adminController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

// Chat routes
router.post("/api/chat", handleUserChatRequest);

// Admin routes
router.delete("/admin/deleteUserData", authenticateToken, deleteUserData);
router.post("/admin/login", adminLogin);

export default router;
