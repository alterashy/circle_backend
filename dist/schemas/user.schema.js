"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createUserSchema = joi_1.default.object({
    fullName: joi_1.default.string().max(100).required(),
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().min(4).max(12).required(),
    password: joi_1.default.string().min(8).required(),
});
exports.updateUserSchema = joi_1.default.object({
    email: joi_1.default.string().email(),
    username: joi_1.default.string().min(4).max(12),
});
