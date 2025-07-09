import Joi from "joi";
import { CreateThreadDTO, UpdateThreadDTO } from "../dtos/post.dto";

export const createThreadSchema = Joi.object<CreateThreadDTO>({
  content: Joi.string().max(2000).optional(),
  images: Joi.string().uri().optional().allow(null, ""),
});

export const updateThreadSchema = Joi.object<UpdateThreadDTO>({
  content: Joi.string().min(1).max(2000).optional(),
  images: Joi.string().uri().optional().allow(null, ""),
});
