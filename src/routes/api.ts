import express from "express";
import { handleUserChatRequest } from "../controllers/chat";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

router.post("/api/chat", handleUserChatRequest);

export default router;
