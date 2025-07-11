import Joi from "joi";
import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";

export const createFollowSchema = Joi.object<CreateFollowDTO>({
  followerId: Joi.string().uuid(),
  followingId: Joi.string().uuid(),
});

export const deleteFollowSchema = Joi.object<DeleteFollowDTO>({
  followerId: Joi.string().uuid(),
  followingId: Joi.string().uuid(),
});

export const toggleFollowSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});

export const getFollowListSchema = Joi.object({
  userId: Joi.string().uuid().required(),
});
