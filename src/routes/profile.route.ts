import express from "express";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import profileController from "../controllers/profile.controller";

const router = express.Router();

router.use(rateLimit("profile"));

router.get("/:userId", profileController.getUserProfile);
router.put("/", authCheck, profileController.updateUserProfile);

export default router;
