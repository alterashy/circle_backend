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
class ReplyService {
    getRepliesByThreadId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.reply.findMany({
                where: { postId },
                include: {
                    user: {
                        omit: {
                            password: true,
                        },
                        include: {
                            profile: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    createReply(userId, postId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = data;
            return yield prisma_1.default.reply.create({
                data: {
                    postId,
                    content,
                    userId,
                },
            });
        });
    }
    updateReply(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = data;
            return yield prisma_1.default.reply.update({ where: { id }, data: { content } });
        });
    }
    deleteReply(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.reply.delete({ where: { id } });
        });
    }
}
exports.default = new ReplyService();
