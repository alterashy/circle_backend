"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_controller_1 = __importDefault(require("../controllers/like.controller"));
const auth_check_middleware_1 = require("../middlewares/auth-check.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const router = express_1.default.Router();
router.use((0, rate_limit_middleware_1.rateLimit)("like"));
router.post("/", auth_check_middleware_1.authCheck, like_controller_1.default.createLike);
router.post("/reply", auth_check_middleware_1.authCheck, like_controller_1.default.createLikeReply);
router.delete("/:postId", auth_check_middleware_1.authCheck, like_controller_1.default.deleteLike);
router.delete("/reply/:replyId", auth_check_middleware_1.authCheck, like_controller_1.default.deleteLikeReply);
exports.default = router;
