import { User, Profile } from "@prisma/client";

export type UpdateProfileDTO = Partial<
  Pick<Profile, "fullName" | "avatarUrl" | "bannerUrl" | "bio"> &
    Pick<User, "username">
>;
