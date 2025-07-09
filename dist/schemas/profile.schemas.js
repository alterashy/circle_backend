"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProfileSchema = joi_1.default.object({
    fullName: joi_1.default.string().max(100),
    username: joi_1.default.string().min(4).max(12),
    bio: joi_1.default.string().max(300).allow(null, ""),
    avatarUrl: joi_1.default.string().uri().allow(null, ""),
    bannerUrl: joi_1.default.string().uri().allow(null, ""),
});
