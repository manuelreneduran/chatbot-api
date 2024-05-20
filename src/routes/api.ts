import express from "express";
import { deleteUserData, handleUserChatRequest } from "../controllers/chat";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("ping");
});

router.post("/api/chat", handleUserChatRequest);

router.delete("/api/deleteUserData", deleteUserData);

export default router;
