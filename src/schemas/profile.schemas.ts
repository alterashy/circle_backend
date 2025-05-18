import Joi from "joi";
import { UpdateProfileDTO } from "../dtos/profile.dto";

export const updateProfileSchema = Joi.object<UpdateProfileDTO>({
	fullName: Joi.string().max(100),
	avatarUrl: Joi.string().uri().allow(null, ""),
	bannerUrl: Joi.string().uri().allow(null, ""),
	bio: Joi.string().max(300).allow(null, ""),
	username: Joi.string().min(4).max(12),
});
