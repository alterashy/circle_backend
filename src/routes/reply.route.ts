import express from "express";
import replyController from "../controllers/reply.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("reply"));

router.get("/:threadId", authCheck, replyController.getRepliesByThreadId);
router.post("/:threadId", authCheck, replyController.createReply);

export default router;
