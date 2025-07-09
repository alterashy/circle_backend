import { NextFunction, Request, Response } from "express";
import likeService from "../services/like.service";
import replyService from "../services/reply.service";
import { createReplySchema } from "../schemas/reply.schema";

class ReplyController {
  async getRepliesByThreadId(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId;
      const replies = await replyService.getRepliesByThreadId(postId);
      res.json(replies);
    } catch (error) {
      next(error);
    }
  }

  async createReply(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.postId;
      const body = req.body;
      const userId = (req as any).user.id;
      console.log(postId, body, userId);
      const validatedBody = await createReplySchema.validateAsync(body);
      const reply = await replyService.createReply(
        userId,
        postId,
        validatedBody
      );
      res.json({
        message: "Reply created!",
        data: { ...reply },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReply(req: Request, res: Response, next: NextFunction) {
    try {
      const replyId = req.params.replyId;
      const body = req.body;
      const validatedBody = await createReplySchema.validateAsync(body);
      const reply = await replyService.updateReply(replyId, validatedBody);
      res.json(reply);
    } catch (error) {
      next(error);
    }
  }

  async deleteReply(req: Request, res: Response, next: NextFunction) {
    try {
      const replyId = req.params.replyId;
      const deleted = await replyService.deleteReply(replyId);
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReplyController();
