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
exports.createUserEmbedding = void 0;
const knex_1 = __importDefault(require("../services/knex"));
const number_1 = require("../utils/number");
const gptController_1 = require("./gptController");
const messagesController_1 = require("./messagesController");
const reactionsController_1 = require("./reactionsController");
const utils_1 = require("./utils");
// Helper function to store interaction in the database
function insertUserEmbeddings(userId, embedding, userInput, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, knex_1.default)("user_embeddings")
                .returning("id")
                .insert({
                user_id: userId,
                embedding: JSON.stringify(embedding),
                user_input: userInput,
                response: response,
            });
        }
        catch (err) {
            console.error("Error storing user embedding:", err);
        }
    });
}
// Helper function to query relevant information from the database
function fetchRelevantUserEmbeddings(userId, embedding) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield (0, knex_1.default)("user_embeddings")
                .where("user_embeddings.user_id", userId)
                .orderByRaw("user_embeddings.embedding <-> ?", [
                JSON.stringify(embedding),
            ])
                .limit(5);
            return result;
        }
        catch (err) {
            console.error("Error querying relevant info:", err);
            throw err; // Rethrow the error to be handled by the caller
        }
    });
}
// Helper function to query relevant reference texts from the database
const fetchRelevantReferenceTexts = (embedding) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.default)("reference_texts")
            .orderByRaw("embedding <-> ?", [JSON.stringify(embedding)])
            .limit(5);
        return result;
    }
    catch (err) {
        console.error("Error querying reference texts:", err);
        throw err;
    }
});
// Helper function to build the context for ChatGPT
const buildContext = (userEmbeddings) => {
    return userEmbeddings
        .map((info) => {
        if (info.user_input) {
            return `${info.created_at}\nuser_input: ${info.user_input}\nresponse: ${info.response}`;
        }
        else {
            return `${info.title}\ntext: ${info.text}`;
        }
    })
        .join("\n");
};
// Endpoint to save user embedding and make request to ChatGPT
const createUserEmbedding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, messageId } = req.body;
    try {
        // fetch the user message from the database
        const message = yield (0, messagesController_1.fetchMessage)(messageId);
        const userInput = message.text;
        // Generate a reaction to the user message
        const gptReactionResponse = yield (0, gptController_1.generateGptReaction)(userInput);
        // parses response in case the AI does a derp and returns a full string
        const aiReactionResponse = ((_a = (0, utils_1.extractReactions)(gptReactionResponse.choices[0].message.content || "")) === null || _a === void 0 ? void 0 : _a[0]) || "";
        // Has a % chance to react to the message
        if (aiReactionResponse && (0, number_1.randomBoolean)(0.85)) {
            (0, reactionsController_1.handleDelayedReaction)(messageId, aiReactionResponse);
        }
        // Generate embedding for the user input
        const embedding = yield (0, utils_1.generateEmbedding)(userInput);
        if (!embedding) {
            return res.status(500).json({ error: "Error generating embedding" });
        }
        // Query the vector database for relevant chat history
        const userEmbeddings = yield fetchRelevantUserEmbeddings(userId, embedding);
        // Query the reference texts for relevant reference texts
        const referenceTexts = yield fetchRelevantReferenceTexts(embedding);
        // Combine the relevant information and reference texts
        userEmbeddings.push(...referenceTexts);
        // Construct the prompt for ChatGPT
        const context = buildContext(userEmbeddings);
        // Generate response using ChatGPT
        const gptResponse = yield (0, gptController_1.generateGptResponse)(userInput, context);
        const aiResponse = gptResponse.choices[0].message.content;
        if (!aiResponse) {
            return res.status(500).json({ error: "Error generating response" });
        }
        // Store the interaction in the database
        yield insertUserEmbeddings(userId, embedding, userInput, aiResponse);
        // Return the response to the user
        res.json({ response: "success" });
        // Delay the insertion of the message by 10-30 seconds to give time to react
        (0, messagesController_1.handleDelayedMessageInsertion)(userId, aiResponse);
    }
    catch (err) {
        console.error("Error handling chat request", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createUserEmbedding = createUserEmbedding;
