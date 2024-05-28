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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractReactions = exports.processAndStoreLargeText = exports.splitTextIntoChunks = exports.generateEmbedding = void 0;
const openAI_1 = __importDefault(require("../services/openAI"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
// Helper function to generate embedding using OpenAI API
function generateEmbedding(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield openAI_1.default.embeddings.create({
            model: "text-embedding-ada-002",
            input: input,
        });
        return response.data[0].embedding;
    });
}
exports.generateEmbedding = generateEmbedding;
// Function to split text into chunks based on character count
function splitTextIntoChunks(text, chunkSize) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        const end = start + chunkSize > text.length ? text.length : start + chunkSize;
        const chunk = text.slice(start, end);
        chunks.push(chunk);
        start = end;
    }
    return chunks;
}
exports.splitTextIntoChunks = splitTextIntoChunks;
// Main function to process and store large reference texts
function processAndStoreLargeText(filePath, title, maxTokens, storeText) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            const fileStream = fs_1.default.createReadStream(filePath);
            const rl = readline_1.default.createInterface({
                input: fileStream,
                crlfDelay: Infinity,
            });
            let text = "";
            try {
                for (var _d = true, rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), _a = rl_1_1.done, !_a; _d = true) {
                    _c = rl_1_1.value;
                    _d = false;
                    const line = _c;
                    text += line + "\n";
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = rl_1.return)) yield _b.call(rl_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            const chunks = splitTextIntoChunks(text, maxTokens);
            for (const chunk of chunks) {
                const embedding = yield generateEmbedding(chunk);
                yield storeText(title, chunk, embedding);
            }
        }
        catch (e) {
            console.log("Error processing and storing reference text:", e);
        }
    });
}
exports.processAndStoreLargeText = processAndStoreLargeText;
// Helper function to extract reactions from text
function extractReactions(text) {
    const reactions = ["haha", "wow", "like", "love", "angry", "sad"];
    const regex = new RegExp(`\\b(${reactions.join("|")})\\b`, "gi");
    const matches = text.match(regex);
    return matches ? matches.map((match) => match.toLowerCase()) : [];
}
exports.extractReactions = extractReactions;
