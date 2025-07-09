import express from "express";
import replyController from "../controllers/reply.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("reply"));

router.get("/:postId", authCheck, replyController.getRepliesByThreadId);
router.post("/:postId", authCheck, replyController.createReply);
router.put("/:id", authCheck, replyController.updateReply);
router.delete("/:id", authCheck, replyController.deleteReply);

export default router;
