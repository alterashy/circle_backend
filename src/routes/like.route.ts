import express from "express";
import likeController from "../controllers/like.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("like"));

router.post("/", authCheck, likeController.createLike);
router.post("/reply", authCheck, likeController.createLikeReply);
router.delete("/:postId", authCheck, likeController.deleteLike);
router.delete("/reply/:replyId", authCheck, likeController.deleteLikeReply);

export default router;
