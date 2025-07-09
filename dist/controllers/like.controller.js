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
const like_service_1 = __importDefault(require("../services/like.service"));
const like_schema_1 = require("../schemas/like.schema");
class LikeController {
    createLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userId = req.user.id;
                const { postId } = yield like_schema_1.createLikeSchema.validateAsync(body);
                const like = yield like_service_1.default.getLikeById(userId, postId || "");
                if (like) {
                    res.status(400).json({
                        message: "You cannot like post twice!",
                    });
                    return;
                }
                yield like_service_1.default.createLike(userId, postId || "");
                res.json({
                    message: "Like success!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = req.params;
                const userId = req.user.id;
                const { postId } = yield like_schema_1.deleteLikeSchema.validateAsync({
                    postId: params.postId,
                });
                const like = yield like_service_1.default.getLikeById(userId, postId || "");
                if (!like) {
                    res.status(404).json({
                        message: "Like not found!",
                    });
                    return;
                }
                yield like_service_1.default.deleteLike(like.id);
                res.json({
                    message: "Unlike success!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    createLikeReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const userId = req.user.id;
                const { replyId } = yield like_schema_1.createLikeReplySchema.validateAsync(body);
                const like = yield like_service_1.default.getLikeByReplyId(userId, replyId || "");
                if (like) {
                    res.status(400).json({
                        message: "You cannot like post twice!",
                    });
                    return;
                }
                yield like_service_1.default.createLikeReply(userId, replyId || "");
                res.json({
                    message: "Like success!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteLikeReply(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { replyId } = req.params;
                const userId = req.user.id;
                const like = yield like_service_1.default.getLikeByReplyId(userId, replyId);
                if (!like) {
                    res.status(404).json({
                        message: "Like not found!",
                    });
                    return;
                }
                yield like_service_1.default.deleteLike(like.id);
                res.json({
                    message: "Unlike success!",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new LikeController();
