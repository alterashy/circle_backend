import express from "express";
import userController from "../controllers/user.controller";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("user"));

router.get("/search", userController.getUsersSearch);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/profile/:username", userController.getUserByUsername);
router.post("/", userController.createUser);
router.patch("/:id", userController.updateUserById);
router.delete("/:id", userController.deleteUserById);

export default router;
