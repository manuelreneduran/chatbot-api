"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMessage = exports.getLatestMessagesFromAllUsers = exports.insertMessage = exports.createMessage = exports.getMessages = exports.handleDelayedMessageInsertion = void 0;
const messagesSerializer_1 = require("../serializers/messagesSerializer");
const knex_1 = __importDefault(require("../services/knex"));
const number_1 = require("../utils/number");
const reactionsController_1 = require("./reactionsController");
const lodash_1 = __importDefault(require("lodash"));
// Helper function to get the latest message from every user
const getLatestMessagesFromAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.default)("messages")
            .select("user_id", "text")
            .max("created_at as latest_created_at")
            .where("user_type", "!=", "Agent")
            .groupBy("user_id", "text");
        // Fetch the full message details for the latest messages
        const latestMessages = lodash_1.default.uniqBy(result, "user_id");
        return latestMessages;
    }
    catch (e) {
        console.error("Error getting latest messages from all users:", e);
    }
});
exports.getLatestMessagesFromAllUsers = getLatestMessagesFromAllUsers;
// Helper function to fetch a message from a user
const fetchMessage = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.default)("messages")
            .where("id", messageId)
            .orderBy("created_at", "desc")
            .first();
        return result;
    }
    catch (e) {
        console.error("Error fetching message:", e);
    }
});
exports.fetchMessage = fetchMessage;
// Helper function to query relevant information from the database
function fetchAllMessages(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, knex_1.default)("messages")
                .join("reactions", "messages.id", "reactions.message_id")
                .where("messages.user_id", userId)
                .select("messages.id as message_id", "messages.*", "reactions.id as reaction_id", "reactions.*");
            return result;
        }
        catch (err) {
            console.error("Error querying relevant info:", err);
            throw err; // Rethrow the error to be handled by the caller
        }
    });
}
// Helper function to store message in the database
function insertMessage(userId, text, userType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [result] = yield (0, knex_1.default)("messages")
                .returning("id")
                .insert({
                user_id: userId,
                text,
                user_type: userType,
            });
            yield (0, reactionsController_1.insertReaction)(result.id);
            return result.id;
        }
        catch (err) {
            console.error("Error storing user embedding:", err);
        }
    });
}
exports.insertMessage = insertMessage;
// Helper function to store message in the database after a delay
const handleDelayedMessageInsertion = (userId, aiResponse) => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield insertMessage(userId, aiResponse, "Agent");
            console.log("Message inserted successfully after 20 seconds");
        }
        catch (error) {
            console.error("Error inserting delayed message", error);
        }
    }), (0, number_1.getRandomNumber)(3000, 7000));
};
exports.handleDelayedMessageInsertion = handleDelayedMessageInsertion;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    try {
        // query messages and reactions
        const messages = yield fetchAllMessages(userId);
        if (!messages) {
            return res.status(200).json({ messages: {} });
        }
        // Serialize messages for the response
        const serializedMessages = (0, messagesSerializer_1.serializeMessages)(messages);
        res.json({ messages: serializedMessages });
    }
    catch (e) {
        console.error("Error fetching messages:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMessages = getMessages;
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, text } = req.body;
    try {
        const messageId = yield insertMessage(userId, text, "User");
        res.json({ messageId });
    }
    catch (e) {
        console.error("Error saving message:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createMessage = createMessage;
