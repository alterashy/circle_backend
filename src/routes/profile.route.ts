import express from "express";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import profileController from "../controllers/profile.controller";
import { uploadImage } from "../middlewares/upload-image.middleware";

const router = express.Router();

router.use(rateLimit("profile"));

router.get("/:userId", profileController.getUserProfile);
router.get("/:username", profileController.getUserProfileByUsername);
router.patch(
  "/:userId",
  authCheck,
  uploadImage.fields([{ name: "avatarUrl" }, { name: "bannerUrl" }]),
  profileController.updateUserProfile
);

export default router;
