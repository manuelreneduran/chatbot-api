"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userEmbeddings_1 = require("../controllers/userEmbeddings");
const auth_1 = require("../middleware/auth");
const authController_1 = require("../controllers/authController");
const adminController_1 = require("../controllers/adminController");
const messagesController_1 = require("../controllers/messagesController");
const reactionsController_1 = require("../controllers/reactionsController");
const referenceTextController_1 = require("../controllers/referenceTextController");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("ping");
});
// Chat routes
router.post("/api/embeddings", userEmbeddings_1.createUserEmbedding);
router.get("/api/messages", messagesController_1.getMessages);
router.post("/api/messages", messagesController_1.createMessage);
router.post("/api/reactions", reactionsController_1.createOrDeleteReaction);
// Admin routes
router.delete("/admin/deleteUserData", auth_1.authenticateToken, adminController_1.deleteUserData);
router.post("/admin/login", authController_1.adminLogin);
router.post("/admin/seed", auth_1.authenticateToken, referenceTextController_1.processAndStoreReferenceText);
exports.default = router;
