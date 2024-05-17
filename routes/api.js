import express from "express";
import multer from "multer";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Ping");
});

export default router;
