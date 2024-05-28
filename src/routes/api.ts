import express from "express";
import { createUserEmbedding } from "../controllers/userEmbeddings";
import { authenticateToken } from "../middleware/auth";
import { adminLogin } from "../controllers/authController";
import { deleteUserData } from "../controllers/adminController";
import { createMessage, getMessages } from "../controllers/messagesController";
import { createOrDeleteReaction } from "../controllers/reactionsController";
import { processAndStoreReferenceText } from "../controllers/referenceTextController";

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
