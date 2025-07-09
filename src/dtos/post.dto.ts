import { Post } from "@prisma/client";

export type CreateThreadDTO = Pick<Post, "content" | "images">;

export type UpdateThreadDTO = Partial<Pick<Post, "content" | "images">>;
