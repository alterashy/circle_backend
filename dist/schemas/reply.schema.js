"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReplySchema = exports.updateReplySchema = exports.createReplySchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createReplySchema = joi_1.default.object({
    content: joi_1.default.string().max(1000),
});
exports.updateReplySchema = joi_1.default.object({
    content: joi_1.default.string().max(1000).optional(),
});
exports.deleteReplySchema = joi_1.default.object({
    id: joi_1.default.string().uuid(),
});
