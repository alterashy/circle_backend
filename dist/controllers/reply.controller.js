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
const reply_service_1 = __importDefault(require("../services/reply.service"));
const reply_schema_1 = require("../schemas/reply.schema");
class ReplyController {
    getRepliesByThreadId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const replies = yield reply_service_1.default.getRepliesByThreadId(postId);
                res.json(replies);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                const body = req.body;
                const userId = req.user.id;
                console.log(postId, body, userId);
                const validatedBody = yield reply_schema_1.createReplySchema.validateAsync(body);
                const reply = yield reply_service_1.default.createReply(userId, postId, validatedBody);
                res.json({
                    message: "Reply created!",
                    data: Object.assign({}, reply),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replyId = req.params.replyId;
                const body = req.body;
                const validatedBody = yield reply_schema_1.createReplySchema.validateAsync(body);
                const reply = yield reply_service_1.default.updateReply(replyId, validatedBody);
                res.json(reply);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const replyId = req.params.replyId;
                const deleted = yield reply_service_1.default.deleteReply(replyId);
                res.json(deleted);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new ReplyController();
