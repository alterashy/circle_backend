import { NextFunction, Request, Response } from "express";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import userService from "../services/user.service";
import prisma from "../libs/prisma";
import { HttpStatus } from "../utils/httpStatus";
import { jsonResponse } from "../utils/jsonResppnse";

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      res
        .status(HttpStatus.OK)
        .json(
          jsonResponse("success", HttpStatus.OK, "Users fetched", { users })
        );
    } catch (error) {
      next(error);
    }
  }

  async getUsersSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query.q as string;
      const currentUserId = (req as any).user.id;

      if (!q.trim()) {
        res.json([]);
        return;
      }

      const users = await userService.getUsersSearch(q, currentUserId);

      res
        .status(HttpStatus.OK)
        .json(
          jsonResponse("success", HttpStatus.OK, "Users fetched", { users })
        );
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "User not found"));
        return;
      }

      res
        .status(HttpStatus.OK)
        .json(jsonResponse("success", HttpStatus.OK, "User fetched", { user }));
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const user = await userService.getUserByUsername(username);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "User not found"));
        return;
      }

      const [followersCount, followingsCount] = await Promise.all([
        prisma.follow.count({
          where: {
            followerId: user?.id,
          },
        }),
        prisma.follow.count({
          where: {
            followingId: user?.id,
          },
        }),
      ]);

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "User fetched", {
          user,
          followersCount,
          followingsCount,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validatedBody = await createUserSchema.validateAsync(body);
      const user = await userService.createUser(validatedBody);
      res
        .status(HttpStatus.OK)
        .json(jsonResponse("success", HttpStatus.OK, "User fetched", { user }));
    } catch (error) {
      next(error);
    }
  }

  async updateUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body;

      let user = await userService.getUserById(id);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "User not found"));
        return;
      }

      const { email, username } = await updateUserSchema.validateAsync(body);

      if (email != "") {
        user.email = email;
      }

      if (username != "") {
        user.username = username;
      }

      const updatedUser = await userService.updateUserById(id, user);

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Profile updated", {
          updatedUser,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await userService.deleteUserById(id);
      res
        .status(HttpStatus.OK)
        .json(jsonResponse("success", HttpStatus.OK, "User deleted", { user }));
    } catch (error) {
      next(error);
    }
  }

  async getSuggestedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = (req as any).user.id;
      const users = await userService.getSuggestedUsers(currentUserId);
      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Sugested users fetched", {
          users,
        })
      );
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
