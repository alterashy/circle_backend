import { NextFunction, Request, Response } from "express";
import likeService from "../services/like.service";
import threadService from "../services/thread.service";
import streamifier from "streamifier";
import { v2 as cloudinary, UploadStream } from "cloudinary";
import { createThreadSchema, updateThreadSchema } from "../schemas/thread.schema";

class ThreadController {
	async getThreads(req: Request, res: Response, next: NextFunction) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const startIndex = (page - 1) * limit;

			const pagination = {
				page,
				limit,
				startIndex,
			};

			const userId = (req as any).user.id;
			const threads = await threadService.getThreads(pagination);
			const newThreads = await Promise.all(
				threads.map(async (thread) => {
					const like = await likeService.getLikeById(userId, thread.id);
					const isLiked = like ? true : false;
					const likesCount = thread.likes.length;
					const repliesCount = thread.replies.length;

					return {
						...thread,
						likesCount,
						repliesCount,
						isLiked,
					};
				})
			);
			res.json(newThreads);
		} catch (error) {
			next(error);
		}
	}

	async getThreadByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const page = parseInt(req.query.page as string) || 1;
			const limit = parseInt(req.query.limit as string) || 10;
			const startIndex = (page - 1) * limit;

			const pagination = {
				page,
				limit,
				startIndex,
			};

			const userId = (req as any).user.id;
			const threads = await threadService.getThreadByUser(userId, pagination);
			const newThreads = await Promise.all(
				threads.map(async (thread) => {
					const like = await likeService.getLikeById(userId, thread.id);
					const isLiked = like ? true : false;
					const likesCount = thread.likes.length;
					const repliesCount = thread.replies.length;

					return {
						...thread,
						likesCount,
						repliesCount,
						isLiked,
					};
				})
			);
			res.json(newThreads);
		} catch (error) {
			next(error);
		}
	}

	async getThreadById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = (req as any).user.id;

			const thread = await threadService.getThreadById(id);

			if (!thread) {
				res.status(404).json({
					message: "Thread is not found!",
				});
				return;
			}

			const like = await likeService.getLikeById(userId, thread.id);
			const isLiked = like ? true : false;
			const likesCount = thread?.likes.length;
			const repliesCount = thread?.replies.length;

			res.json({
				...thread,
				likesCount,
				repliesCount,
				isLiked,
			});
		} catch (error) {
			next(error);
		}
	}

	async createThread(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/CreateThreadDTO"
                      }  
                  }
              }
          } 
      */

		try {
			let imageUrl: string = "";

			if (req.file) {
				imageUrl = await new Promise((resolve, reject) => {
					if (req.file) {
						try {
							const stream = cloudinary.uploader.upload_stream({}, (error, result) => {
								if (error) return console.error(error);
								resolve(result?.secure_url || "");
							});
							streamifier.createReadStream(req.file.buffer).pipe(stream);
						} catch (error) {
							reject(error);
						}
					}
				});
			}

			const body = {
				...req.body,
				images: imageUrl || undefined,
			};

			const userId = (req as any).user.id;
			const validatedBody = await createThreadSchema.validateAsync(body);
			const thread = await threadService.createThread(userId, validatedBody);
			res.json({
				message: "Thread created!",
				data: { ...thread },
			});
		} catch (error) {
			next(error);
		}
	}

	async updateThread(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/UpdateThreadDTO"
                      }  
                  }
              }
          } 
      */

		let imageUrl: string = "";

		if (req.file) {
			imageUrl = await new Promise((resolve, reject) => {
				if (req.file) {
					try {
						const stream = cloudinary.uploader.upload_stream({}, (error, result) => {
							if (error) return console.error(error);
							resolve(result?.secure_url || "");
						});
						streamifier.createReadStream(req.file.buffer).pipe(stream);
					} catch (error) {
						reject(error);
					}
				}
			});
		}
		const body = {
			...req.body,
			images: imageUrl || undefined,
		};
		const validatedBody = await updateThreadSchema.validateAsync(body);
		const userId = (req as any).user.id;
		const threadId = req.params.id;

		try {
			const updated = await threadService.update(threadId, userId, validatedBody);
			res.json(updated);
		} catch (error) {
			next(error);
		}
	}

	async deleteThread(req: Request, res: Response, next: NextFunction) {
		const userId = (req as any).user.id;
		const threadId = req.params.id;

		try {
			const deleted = await threadService.delete(threadId, userId);
			res.json(deleted);
		} catch (error) {
			next(error);
		}
	}
}

export default new ThreadController();
function next(error: unknown) {
	throw new Error("Function not implemented.");
}
