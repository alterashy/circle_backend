import Joi from "joi";
import {
  CreateLikeDTO,
  CreateLikeReplyDTO,
  DeleteLikeDTO,
  DeleteLikeReplyDTO,
} from "../dtos/like.dto";

export const createLikeSchema = Joi.object<CreateLikeDTO>({
  postId: Joi.string().uuid(),
});

export const deleteLikeSchema = Joi.object<DeleteLikeDTO>({
  postId: Joi.string().uuid(),
});

export const createLikeReplySchema = Joi.object<CreateLikeReplyDTO>({
  replyId: Joi.string().uuid().optional(),
});

export const deleteLikeReplySchema = Joi.object<DeleteLikeReplyDTO>({
  replyId: Joi.string().uuid().optional(),
});
