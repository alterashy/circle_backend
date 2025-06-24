import Joi from "joi";
import { CreateReplyDTO } from "../dtos/reply.dto";

export const createReplySchema = Joi.object<CreateReplyDTO>({
  content: Joi.string().max(1000),
});

export const updateReplySchema = Joi.object<CreateReplyDTO>({
  content: Joi.string().max(1000).optional(),
});

export const deleteReplySchema = Joi.object({
  id: Joi.string().uuid(),
});
