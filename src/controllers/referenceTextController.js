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
exports.processAndStoreReferenceText = exports.storeReferenceText = void 0;
const knex_1 = __importDefault(require("../services/knex"));
const path_1 = require("path");
const utils_1 = require("./utils");
// Helper function to store reference text and its embedding in the database
function storeReferenceText(title, text, embedding) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, knex_1.default)("reference_texts").insert({
                title,
                text,
                embedding: JSON.stringify(embedding),
            });
            console.log("User embedding stored successfully");
        }
        catch (err) {
            console.error("Error storing user embedding:", err);
        }
    });
}
exports.storeReferenceText = storeReferenceText;
function processAndStoreReferenceText(res, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = (0, path_1.resolve)("./hamilton_1.txt");
        const title = "Hamilton_1";
        const maxTokens = 100; // Adjust the token size as needed
        try {
            yield (0, utils_1.processAndStoreLargeText)(filePath, title, maxTokens, storeReferenceText);
            res.json({ message: "Reference text stored successfully" });
        }
        catch (e) {
            console.log("Error processing and storing reference text:", e);
            res
                .status(500)
                .json({ message: "Error processing and storing reference text" });
        }
    });
}
exports.processAndStoreReferenceText = processAndStoreReferenceText;
