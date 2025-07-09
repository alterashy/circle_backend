"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowListSchema = exports.toggleFollowSchema = exports.deleteFollowSchema = exports.createFollowSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFollowSchema = joi_1.default.object({
    followerId: joi_1.default.string().uuid(),
    followingId: joi_1.default.string().uuid(),
});
exports.deleteFollowSchema = joi_1.default.object({
    followerId: joi_1.default.string().uuid(),
    followingId: joi_1.default.string().uuid(),
});
exports.toggleFollowSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
});
exports.getFollowListSchema = joi_1.default.object({
    userId: joi_1.default.string().uuid().required(),
});
