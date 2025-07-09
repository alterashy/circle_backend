import express from "express";
import userController from "../controllers/user.controller";
import { rateLimit } from "../middlewares/rate-limit.middleware";
import { authCheck } from "../middlewares/auth-check.middleware";

const router = express.Router();

router.use(rateLimit("user"));

router.get("/search", authCheck, userController.getUsersSearch);
router.get("/", userController.getUsers);
router.get("/suggest", authCheck, userController.getSuggestedUsers);
router.get("/:id", userController.getUserById);
router.get("/profile/:username", userController.getUserByUsername);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export default router;
