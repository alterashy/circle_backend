import { Follow } from "@prisma/client";

export type CreateFollowDTO = Pick<Follow, "id">;

export type DeleteFollowDTO = Pick<Follow, "id">;
