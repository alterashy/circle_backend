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
const prisma_1 = __importDefault(require("../libs/prisma"));
class LikeService {
    getLikeById(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.findFirst({
                where: {
                    userId,
                    postId,
                },
            });
        });
    }
    getLikeByReplyId(userId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.findFirst({
                where: {
                    userId,
                    replyId,
                },
            });
        });
    }
    createLike(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.create({
                data: {
                    userId,
                    postId,
                },
            });
        });
    }
    deleteLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.delete({
                where: { id },
            });
        });
    }
    createLikeReply(userId, replyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.create({
                data: {
                    userId,
                    replyId,
                },
            });
        });
    }
    deleteLikeReply(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.delete({
                where: { id },
            });
        });
    }
    getLikesByUserAndPostIds(userId, postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.like.findMany({
                where: {
                    userId,
                    postId: {
                        in: postIds,
                    },
                },
                select: {
                    postId: true,
                },
            });
        });
    }
}
exports.default = new LikeService();
