import { NextFunction, Request, Response } from "express";
import {
  createFollowSchema,
  deleteFollowSchema,
} from "../schemas/follow.schema";
import followService from "../services/follow.service";

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

  async createFollow(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/CreateFollowDTO"
                          }  
                      }
                  }
              } 
          */
    try {
      const body = req.body;
      const userId = (req as any).user.id;
      const { id } = await createFollowSchema.validateAsync(body);

      await followService.createFollow(userId, id);
      res.json({
        message: "Follow success!",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFollow(req: Request, res: Response, next: NextFunction) {
    try {
      const params = req.params;
      const userId = (req as any).user.id;
      const { id } = await deleteFollowSchema.validateAsync(params);

      await followService.deleteFollow(id);
      res.json({
        message: "Unfollow success!",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new FollowController();
