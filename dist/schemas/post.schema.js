"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateThreadSchema = exports.createThreadSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createThreadSchema = joi_1.default.object({
    content: joi_1.default.string().max(2000).optional(),
    images: joi_1.default.string().uri().optional().allow(null, ""),
});
exports.updateThreadSchema = joi_1.default.object({
    content: joi_1.default.string().min(1).max(2000).optional(),
    images: joi_1.default.string().uri().optional().allow(null, ""),
});
