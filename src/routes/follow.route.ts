import express from "express";
import followController from "../controllers/follow.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("follow"));

router.get("/followers/:id", authCheck, followController.getFollowersById);
router.get("/followings/:id", authCheck, followController.getFollowingById);
router.get("/check/:followerId/:followingId", followController.check);

export default router;
