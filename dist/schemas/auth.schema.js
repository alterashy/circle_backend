"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.registerSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
});
exports.registerSchema = joi_1.default.object({
    fullName: joi_1.default.string().max(100).required(),
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().min(4).max(12).required(),
    password: joi_1.default.string().min(8).required(),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().min(8).required(),
    newPassword: joi_1.default.string().min(8).required(),
});
