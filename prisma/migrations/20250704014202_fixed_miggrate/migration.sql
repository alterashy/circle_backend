-- AlterTable
ALTER TABLE "posts" RENAME CONSTRAINT "threads_pkey" TO "posts_pkey";

-- RenameForeignKey
ALTER TABLE "likes" RENAME CONSTRAINT "likes_threadId_fkey" TO "likes_postId_fkey";

-- RenameForeignKey
ALTER TABLE "posts" RENAME CONSTRAINT "threads_userId_fkey" TO "posts_userId_fkey";

-- RenameForeignKey
ALTER TABLE "replies" RENAME CONSTRAINT "replies_threadId_fkey" TO "replies_postId_fkey";
