import { NextFunction, Request, Response } from "express";
import likeService from "../services/like.service";
import {
  createLikeReplySchema,
  createLikeSchema,
  deleteLikeReplySchema,
  deleteLikeSchema,
} from "../schemas/like.schema";

class LikeController {
  async createLike(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { postId } = await createLikeSchema.validateAsync(body);
      const like = await likeService.getLikeById(userId, postId || "");

      if (like) {
        res.status(400).json({
          message: "You cannot like post twice!",
        });
        return;
      }

      await likeService.createLike(userId, postId || "");
      res.json({
        message: "Like success!",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLike(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params;
      const userId = (req as any).user.id;
      const { postId } = await deleteLikeSchema.validateAsync({
        postId: params.postId,
      });

      const like = await likeService.getLikeById(userId, postId || "");

      if (!like) {
        res.status(404).json({
          message: "Like not found!",
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.json({
        message: "Unlike success!",
      });
    } catch (error) {
      next(error);
    }
  }

  async createLikeReply(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { replyId } = await createLikeReplySchema.validateAsync(body);
      const like = await likeService.getLikeByReplyId(userId, replyId || "");

      if (like) {
        res.status(400).json({
          message: "You cannot like post twice!",
        });
        return;
      }

      await likeService.createLikeReply(userId, replyId || "");
      res.json({
        message: "Like success!",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLikeReply(req: Request, res: Response, next: NextFunction) {
    try {
      const { replyId } = req.params;
      const userId = (req as any).user.id;
      const like = await likeService.getLikeByReplyId(userId, replyId);

      if (!like) {
        res.status(404).json({
          message: "Like not found!",
        });
        return;
      }

      await likeService.deleteLike(like.id);
      res.json({
        message: "Unlike success!",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LikeController();
