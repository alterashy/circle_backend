"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_check_middleware_1 = require("../middlewares/auth-check.middleware");
const rate_limit_middleware_1 = require("../middlewares/rate-limit.middleware");
const profile_controller_1 = __importDefault(require("../controllers/profile.controller"));
const upload_image_middleware_1 = require("../middlewares/upload-image.middleware");
const router = express_1.default.Router();
router.use((0, rate_limit_middleware_1.rateLimit)("profile"));
router.get("/:userId", profile_controller_1.default.getUserProfile);
router.get("/:username", profile_controller_1.default.getUserProfileByUsername);
router.patch("/:userId", auth_check_middleware_1.authCheck, upload_image_middleware_1.uploadImage.fields([{ name: "avatarUrl" }, { name: "bannerUrl" }]), profile_controller_1.default.updateUserProfile);
exports.default = router;
