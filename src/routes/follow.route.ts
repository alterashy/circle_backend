import express from "express";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import followController from "../controllers/follow.controller";

const router = express.Router();

router.use(rateLimit("follow"));

router.get("/follower/:id", authCheck, followController.getFollowers);
router.get("/following/:id", authCheck, followController.getFollowing);
router.get("/:id/followers", followController.getFollowerCount);
router.get("/:id/following", followController.getFollowingCount);
router.post("/", authCheck, followController.createFollow);
router.delete("/:id", authCheck, followController.deleteFollow);

export default router;
