"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reply_controller_1 = __importDefault(require("../controllers/reply.controller"));
const auth_check_middleware_1 = require("../middlewares/auth-check.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const router = express_1.default.Router();
router.use((0, rate_limit_middleware_1.rateLimit)("reply"));
router.get("/:postId", auth_check_middleware_1.authCheck, reply_controller_1.default.getRepliesByThreadId);
router.post("/:postId", auth_check_middleware_1.authCheck, reply_controller_1.default.createReply);
router.put("/:id", auth_check_middleware_1.authCheck, reply_controller_1.default.updateReply);
router.delete("/:id", auth_check_middleware_1.authCheck, reply_controller_1.default.deleteReply);
exports.default = router;
