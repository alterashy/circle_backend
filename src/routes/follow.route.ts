import express from "express";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import followController from "../controllers/follow.controller";

const router = express.Router();

router.use(rateLimit("follow"));

router.get("/followers/:id", authCheck, followController.getFollowersById);
router.get("/followings/:id", authCheck, followController.getFollowingById);
router.post("/", authCheck, followController.createFollow);
router.delete("/:id", authCheck, followController.deleteFollow);

export default router;
