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
exports.deleteUserData = void 0;
const knex_1 = __importDefault(require("../services/knex"));
const deleteUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        yield (0, knex_1.default)("user_embeddings").where("user_id", userId).del();
        yield (0, knex_1.default)("reactions")
            .whereIn("message_id", function () {
            this.select("id").from("messages").where("user_id", userId);
        })
            .del();
        yield (0, knex_1.default)("messages").where("user_id", userId).del();
        res.json({ message: "User data deleted successfully" });
    }
    catch (e) {
        console.error("Error deleting user data", e);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteUserData = deleteUserData;
