import express from "express";
import { createUserEmbedding } from "../controllers/userEmbeddings";
import { authenticateToken } from "../middleware/auth";
import { adminLogin } from "../controllers/authController";
import { deleteUserData } from "../controllers/adminController";
import { createMessage, getMessages } from "../controllers/messagesController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

// Chat routes
router.post("/api/embeddings", createUserEmbedding);
router.get("/api/messages", getMessages);
router.post("/api/messages", createMessage);

// Admin routes
router.delete("/admin/deleteUserData", authenticateToken, deleteUserData);
router.post("/admin/login", adminLogin);

export default router;
