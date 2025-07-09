import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import streamifier from "streamifier";
import { createThreadSchema, updateThreadSchema } from "../schemas/post.schema";
import likeService from "../services/like.service";
import threadService from "../services/post.service";
import { HttpStatus } from "../utils/httpStatus";
import { jsonResponse } from "../utils/jsonResppnse";

class PostController {
  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const startIndex = (page - 1) * limit;

      const userId = (req as any).user.id;
      const pagination = { limit, startIndex };

      const [posts, totalPosts] = await Promise.all([
        threadService.getAllPosts(pagination),
        threadService.countAllPosts(),
      ]);

      const postIds = posts.map((post) => post.id);
      const userLikes = await likeService.getLikesByUserAndPostIds(
        userId,
        postIds
      );

      const likedPostSet = new Set(userLikes.map((like) => like.postId));

      const newPosts = posts.map((post) => ({
        id: post.id,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        isEdited: post.isEdited,
        user: post.user,
        likesCount: post._count.likes,
        repliesCount: post._count.replies,
        isLiked: likedPostSet.has(post.id),
      }));

      const hasNextPage = startIndex + posts.length < totalPosts;

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "All posts fetched", {
          posts: newPosts,
          pagination: {
            page,
            limit,
            total: totalPosts,
            hasNextPage,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  async getFeedPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const startIndex = (page - 1) * limit;

      const pagination = { page, limit, startIndex };
      const currentUserId = (req as any).user.id;

      const posts = await threadService.getFeedPosts(currentUserId, pagination);

      const postIds = posts.map((p) => p.id);

      const likedPosts = await likeService.getLikesByUserAndPostIds(
        currentUserId,
        postIds
      );
      const likedPostSet = new Set(likedPosts.map((like) => like.postId));

      const result = posts.map((post) => ({
        ...post,
        likesCount: post.likes.length,
        repliesCount: post.replies.length,
        isLiked: likedPostSet.has(post.id),
      }));

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Feed posts fetched", {
          posts: result,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction) {
    try {
      const postId = req.params.id;
      const currentUserId = (req as any).user.id;

      const post = await threadService.getPostById(postId, currentUserId);

      if (!post) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "Post not found"));
        return;
      }

      res
        .status(HttpStatus.OK)
        .json(jsonResponse("success", HttpStatus.OK, "Post fetched", { post }));
    } catch (error) {
      next(error);
    }
  }

  async getPostsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.userId;
      const currentUserId = (req as any).user.id;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const startIndex = (page - 1) * limit;

      const hasImage = req.query.hasImage === "true";

      const posts = await threadService.getPostsByUser(
        targetUserId,
        currentUserId,
        { limit, startIndex },
        hasImage
      );

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "User posts fetched", {
          posts,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getPostsByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const targetUsername = req.params.username;
      const currentUserId = (req as any).user.id;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const startIndex = (page - 1) * limit;

      const hasImage = req.query.hasImage === "true";

      const posts = await threadService.getPostsByUsername(
        targetUsername,
        currentUserId,
        { limit, startIndex },
        hasImage
      );

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "User posts fetched", {
          posts,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async getExplorePosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const startIndex = (page - 1) * limit;

      const pagination = { limit, startIndex };

      const posts = await threadService.getExplorePosts(userId, pagination);

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Explore posts fetched", {
          posts,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      let imageUrl: string = "";

      if (req.file) {
        imageUrl = await new Promise((resolve, reject) => {
          if (req.file) {
            try {
              const stream = cloudinary.uploader.upload_stream(
                {},
                (error, result) => {
                  if (error) return console.error(error);
                  resolve(result?.secure_url || "");
                }
              );
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
      const post = await threadService.createPost(userId, validatedBody);
      res.json({
        message: "Post created",
        data: { ...post },
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    let imageUrl: string = "";

    if (req.file) {
      imageUrl = await new Promise((resolve, reject) => {
        if (req.file) {
          try {
            const stream = cloudinary.uploader.upload_stream(
              {},
              (error, result) => {
                if (error) return console.error(error);
                resolve(result?.secure_url || "");
              }
            );
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
    const postId = req.params.id;

    try {
      const updated = await threadService.updatePost(
        postId,
        userId,
        validatedBody
      );
      res
        .status(HttpStatus.OK)
        .json(
          jsonResponse("success", HttpStatus.OK, "Post updated", { updated })
        );
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const postId = req.params.id;

    try {
      const deleted = await threadService.deletePost(postId, userId);
      res.json(deleted);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
