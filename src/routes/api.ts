import express from "express";
import {
  deleteUserData,
  handleUserChatRequest,
} from "../controllers/chatController";
import { authenticateToken } from "../middleware/auth";
import { adminLogin } from "../controllers/authController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

router.post("/api/chat", handleUserChatRequest);

router.delete("/admin/deleteUserData", authenticateToken, deleteUserData);

router.post("/admin/login", adminLogin);
export default router;
