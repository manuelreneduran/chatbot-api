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
exports.handleDelayedReaction = exports.createOrDeleteReaction = exports.getReaction = exports.updateReaction = exports.insertReaction = void 0;
const knex_1 = __importDefault(require("../services/knex"));
const number_1 = require("../utils/number");
// Helper function to store reaction in the database
function insertReaction(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, knex_1.default)("reactions").insert({
                message_id: messageId,
                like: false,
                love: false,
                haha: false,
                wow: false,
                sad: false,
                angry: false,
            });
        }
        catch (e) {
            console.error("Error storing reaction:", e);
        }
    });
}
exports.insertReaction = insertReaction;
function updateReaction(messageId, emoji, state) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, knex_1.default)("reactions")
                .where("message_id", messageId)
                .update({ [emoji]: state });
        }
        catch (e) {
            console.error("Error updating reaction:", e);
        }
    });
}
exports.updateReaction = updateReaction;
function getReaction(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, knex_1.default)("reactions").where("message_id", messageId);
            return result[0];
        }
        catch (e) {
            console.error("Error getting reaction:", e);
        }
    });
}
exports.getReaction = getReaction;
const createOrDeleteReaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId, type } = req.body;
    const reaction = yield getReaction(messageId);
    // If the reaction is already set, remove it
    if (reaction[type]) {
        try {
            yield updateReaction(messageId, type, false);
            return res.json({ message: "Reaction removed" });
        }
        catch (e) {
            console.error("Error removing reaction:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        // Otherwise, add the reaction
        try {
            yield updateReaction(messageId, type, true);
            res.json({ message: "Reaction added" });
        }
        catch (e) {
            console.error("Error adding reaction:", e);
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
exports.createOrDeleteReaction = createOrDeleteReaction;
const handleDelayedReaction = (messageId, aiReactionResponse) => {
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield updateReaction(messageId, aiReactionResponse, true);
            console.log("Reaction inserted successfully after X seconds");
        }
        catch (error) {
            console.error("Error inserting delayed reaction", error);
        }
    }), (0, number_1.getRandomNumber)(1, 3000));
};
exports.handleDelayedReaction = handleDelayedReaction;
