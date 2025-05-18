import { Reply } from "@prisma/client";

export type CreateReplyDTO = Pick<Reply, "threadId" | "content">;
export type UpdateReplyDTO = Partial<Pick<Reply, "content">>;
