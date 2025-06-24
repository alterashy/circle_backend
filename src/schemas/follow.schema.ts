import Joi from "joi";
import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";

export const createFollowSchema = Joi.object<CreateFollowDTO>({
  followerId: Joi.string().uuid(),
  followingId: Joi.string().uuid(),
});

export const deleteFollowSchema = Joi.object<DeleteFollowDTO>({
  followingId: Joi.string().uuid(),
});
