import express from "express";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import {
  getFollowCountController,
  getFollowersController,
  getFollowingsController,
  getFollowSuggestionsController,
  toggleFollowController,
} from "../controllers/follow.controller";

const router = express.Router();

router.use(rateLimit("follow"));

router.post("/", authCheck, toggleFollowController);
router.get("/followers/:userId", authCheck, getFollowersController);
router.get("/followings/:userId", authCheck, getFollowingsController);
router.get("/count/:userId", authCheck, getFollowCountController);
router.get("/suggestions", authCheck, getFollowSuggestionsController);

export default router;
