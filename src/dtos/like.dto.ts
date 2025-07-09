import { Like } from "@prisma/client";

export type CreateLikeDTO = Pick<Like, "postId">;

export type DeleteLikeDTO = Pick<Like, "postId">;

export type CreateLikeReplyDTO = Pick<Like, "replyId">;

export type DeleteLikeReplyDTO = Pick<Like, "replyId">;
