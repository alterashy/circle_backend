import express from "express";
import likeController from "../controllers/like.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("like"));

router.post("/", authCheck, likeController.createLike);
router.delete("/:threadId", authCheck, likeController.deleteLike);

export default router;
