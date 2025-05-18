import Joi from "joi";
import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";

export const createFollowSchema = Joi.object<CreateFollowDTO>({
	id: Joi.string().uuid(),
});

export const deleteFollowSchema = Joi.object<DeleteFollowDTO>({
	id: Joi.string().uuid(),
});
