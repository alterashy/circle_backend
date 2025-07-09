"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_check_middleware_1 = require("../middlewares/auth-check.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const router = express_1.default.Router();
router.use((0, rate_limit_middleware_1.rateLimit)("auth"));
router.post("/login", auth_controller_1.default.login);
router.post("/register", auth_controller_1.default.register);
router.post("/check", auth_check_middleware_1.authCheck, auth_controller_1.default.check);
router.post("/forgot-password", auth_controller_1.default.forgotPassword);
router.post("/reset-password", auth_check_middleware_1.authCheck, auth_controller_1.default.resetPassword);
exports.default = router;
