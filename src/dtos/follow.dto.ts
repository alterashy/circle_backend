import { Follow } from "@prisma/client";

export type CreateFollowDTO = Pick<Follow, "followerId" | "followingId">;

export type DeleteFollowDTO = Pick<Follow, "followerId" | "followingId">;
