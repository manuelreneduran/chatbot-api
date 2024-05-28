import express from "express";
import { createUserEmbedding } from "../controllers/userEmbeddings.js";
import { authenticateToken } from "../middleware/auth.js";
import { adminLogin } from "../controllers/authController.js";
import { deleteUserData } from "../controllers/adminController.js";
import {
  createMessage,
  getMessages,
} from "../controllers/messagesController.js";
import { createOrDeleteReaction } from "../controllers/reactionsController.js";
import { processAndStoreReferenceText } from "../controllers/referenceTextController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

// Chat routes
router.post("/api/embeddings", createUserEmbedding);
router.get("/api/messages", getMessages);
router.post("/api/messages", createMessage);
router.post("/api/reactions", createOrDeleteReaction);

// Admin routes
router.delete("/admin/deleteUserData", authenticateToken, deleteUserData);
router.post("/admin/login", adminLogin);
router.post("/admin/seed", authenticateToken, processAndStoreReferenceText);

export default router;
