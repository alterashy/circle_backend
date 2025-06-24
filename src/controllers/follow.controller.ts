import { NextFunction, Request, Response } from "express";
import {
  createFollowSchema,
  deleteFollowSchema,
} from "../schemas/follow.schema";
import followService from "../services/follow.service";
import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";

class FollowController {
  async getFollowersById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const followers = await followService.getFollowersById(userId);
      res.status(200).json(followers);
    } catch (error) {
      next(error);
    }
  }

  async getFollowingById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const followings = await followService.getFollowingsById(userId);
      res.status(200).json(followings);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response) {
    const body: CreateFollowDTO = req.body;

    try {
      const follow = await followService.createFollow(
        body.followerId,
        body.followingId
      );
      res.status(201).json({ message: "Followed successfully", data: follow });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to follow" });
    }
  }

  async delete(req: Request, res: Response) {
    const body: DeleteFollowDTO = req.body;

    try {
      const follow = await followService.deleteFollow(
        body.followerId,
        body.followingId
      );
      res.json({ message: "Unfollowed successfully", data: follow });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to unfollow" });
    }
  }

  async check(req: Request, res: Response) {
    const { followerId, followingId } = req.params;

    try {
      const follow = await followService.checkFollow(followerId, followingId);
      res.json({ message: "Check follow success", data: follow });
    } catch (error) {
      res.status(500).json({ message: "Failed to check follow", error });
    }
  }
}

export default new FollowController();
