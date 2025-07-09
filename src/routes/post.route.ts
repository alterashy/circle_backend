import express from "express";
import postController from "../controllers/post.controller";
import { uploadImage } from "../middlewares/upload-image.middleware";
import { authCheck } from "../middlewares/auth-check.middleware";
import { rateLimit } from "../middlewares/rate-limit.middleware";

const router = express.Router();

router.use(rateLimit("post"));

router.get("/", authCheck, postController.getAllPosts);
router.get("/:id", authCheck, postController.getPostById);
router.get("/feed", authCheck, postController.getFeedPosts);
router.get("/explore", authCheck, postController.getExplorePosts);
router.get("/user/:userId", authCheck, postController.getPostsByUser);
router.get("/username/:username", authCheck, postController.getPostsByUsername);
router.post(
  "/",
  authCheck,
  uploadImage.single("images"),
  postController.createPost
);
router.patch(
  "/:id",
  authCheck,
  uploadImage.single("images"),
  postController.createPost
);
router.delete("/:id", authCheck, postController.deletePost);

export default router;
