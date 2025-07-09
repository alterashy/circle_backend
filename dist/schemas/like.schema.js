"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLikeReplySchema = exports.createLikeReplySchema = exports.deleteLikeSchema = exports.createLikeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createLikeSchema = joi_1.default.object({
    postId: joi_1.default.string().uuid(),
});
exports.deleteLikeSchema = joi_1.default.object({
    postId: joi_1.default.string().uuid(),
});
exports.createLikeReplySchema = joi_1.default.object({
    replyId: joi_1.default.string().uuid().optional(),
});
exports.deleteLikeReplySchema = joi_1.default.object({
    replyId: joi_1.default.string().uuid().optional(),
});
