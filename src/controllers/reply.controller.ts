import { NextFunction, Request, Response } from "express";
import likeService from "../services/like.service";
import replyService from "../services/reply.service";
import { createReplySchema } from "../schemas/reply.schema";

class ReplyController {
	async getRepliesByThreadId(req: Request, res: Response, next: NextFunction) {
		try {
			const threadId = req.params.threadId;
			const replies = await replyService.getRepliesByThreadId(threadId);
			res.json(replies);
		} catch (error) {
			next(error);
		}
	}

	async createReply(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/CreateReplyDTO"
                      }  
                  }
              }
          } 
      */

		try {
			const threadId = req.params.threadId;
			const body = req.body;
			const userId = (req as any).user.id;
			console.log(threadId, body, userId);
			const validatedBody = await createReplySchema.validateAsync(body);
			const reply = await replyService.createReply(userId, threadId, validatedBody);
			res.json({
				message: "Reply created!",
				data: { ...reply },
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new ReplyController();
