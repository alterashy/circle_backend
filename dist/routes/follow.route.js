"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_check_middleware_1 = require("../middlewares/auth-check.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const follow_controller_1 = require("../controllers/follow.controller");
const router = express_1.default.Router();
router.use((0, rate_limit_middleware_1.rateLimit)("follow"));
router.post("/", auth_check_middleware_1.authCheck, follow_controller_1.toggleFollowController);
router.get("/followers/:userId", auth_check_middleware_1.authCheck, follow_controller_1.getFollowersController);
router.get("/followings/:userId", auth_check_middleware_1.authCheck, follow_controller_1.getFollowingsController);
router.get("/count/:userId", auth_check_middleware_1.authCheck, follow_controller_1.getFollowCountController);
router.get("/suggestions", auth_check_middleware_1.authCheck, follow_controller_1.getFollowSuggestionsController);
exports.default = router;
