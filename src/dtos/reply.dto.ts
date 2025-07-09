import { Reply } from "@prisma/client";

export type CreateReplyDTO = Pick<Reply, "postId" | "content">;

export type UpdateReplyDTO = Partial<Pick<Reply, "content">>;

export type deleteReplyDTO = Pick<Reply, "id">;
