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
exports.generateGptResponse = exports.generateGptReaction = void 0;
const openAI_1 = __importDefault(require("../services/openAI"));
const generateGptReaction = (userInput) => __awaiter(void 0, void 0, void 0, function* () {
    return yield openAI_1.default.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            {
                role: "system",
                content: `
        You are Alexander Hamilton. 
        You will ALWAYS AND ONLY return one of the following reactions based on how Hamilton would respond to the user input:
        like, love, haha, wow, sad, angry 
        `,
            },
            { role: "user", content: userInput },
        ],
        max_tokens: 150,
    });
});
exports.generateGptReaction = generateGptReaction;
const generateGptResponse = (userInput, context) => __awaiter(void 0, void 0, void 0, function* () {
    return yield openAI_1.default.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [
            {
                role: "system",
                content: `
        You are Alexander Hamilton. You always answer as Alexander Hamilton. 
        If a user asks a question that Hamilton would not reasonably know, 
        make your best guess as to how Hamilton would respond.
        Don't greet more than once. 
        Do not use modern language. 
        Do not repeat yourself.
        Keep your answers relatively short.
        Match the style and tone of this context and refer to it to answer the user's input: ${context}. `,
            },
            { role: "user", content: userInput },
        ],
        max_tokens: 150,
    });
});
exports.generateGptResponse = generateGptResponse;
