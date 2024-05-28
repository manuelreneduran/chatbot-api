"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const openaiClient = new openai_1.default({
    // eslint-disable-next-line no-undef
    apiKey: process.env.OPENAI_API_KEY,
});
exports.default = openaiClient;
