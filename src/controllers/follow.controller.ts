import { NextFunction, Request, Response } from "express";
import { toggleFollowSchema } from "../schemas/follow.schema";
import {
  getFollowCount,
  getFollowers,
  getFollowings,
  getFollowSuggestions,
  toggleFollow,
} from "../services/follow.service";
import { HttpStatus } from "../utils/httpStatus";
import { jsonResponse } from "../utils/jsonResppnse";

export const toggleFollowController = async (req: Request, res: Response) => {
  const { error, value } = toggleFollowSchema.validate(req.body);
  if (error) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json(jsonResponse("error", HttpStatus.BAD_REQUEST, error.message, null));
    return;
  }

  const currentUserId = (req as any).user.id;
  const targetUserId = value.userId;

  try {
    const result = await toggleFollow(currentUserId, targetUserId);
    res.json(result);
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        jsonResponse(
          "error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to Follow/Unfollow",
          null
        )
      );
  }
};

export const getFollowersController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const currentUserId = (req as any).user.id;
    const followers = await getFollowers(userId, currentUserId);
    res
      .status(HttpStatus.OK)
      .json(
        jsonResponse(
          "success",
          HttpStatus.OK,
          "Followers retrieved successfully",
          followers
        )
      );
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        jsonResponse(
          "error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to retrieve Followers",
          null
        )
      );
  }
};

export const getFollowingsController = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const currentUserId = (req as any).user.id;

  try {
    const followings = await getFollowings(userId, currentUserId);
    res
      .status(HttpStatus.OK)
      .json(
        jsonResponse(
          "success",
          HttpStatus.OK,
          "Followings retrieved successfully",
          followings
        )
      );
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        jsonResponse(
          "error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to retrieve Followings",
          null
        )
      );
  }
};

export const getFollowCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const counts = await getFollowCount(userId);
    res.status(HttpStatus.OK).json({
      status: "success",
      code: HttpStatus.OK,
      message: "Follow counts retrieved successfully",
      data: counts,
    });
  } catch (err) {
    next(err);
  }
};

export const getFollowSuggestionsController = async (
  req: Request,
  res: Response
) => {
  const currentUserId = (req as any).user.id;

  try {
    const suggestions = await getFollowSuggestions(currentUserId);
    res
      .status(HttpStatus.OK)
      .json(
        jsonResponse(
          "success",
          HttpStatus.OK,
          "Follow suggestions retrieved successfully",
          { suggestions }
        )
      );
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        jsonResponse(
          "error",
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to retrieve follow suggestions",
          null
        )
      );
  }
};
