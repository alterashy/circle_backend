import express from "express";
import authController from "../controllers/auth.controller";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("auth"));

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/check", authCheck, authController.check);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authCheck, authController.resetPassword);

export default router;
