import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import prisma from "../libs/prisma";

class LikeService {
  async getLikeById(userId: string, postId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        postId,
      },
    });
  }

  async getLikeByReplyId(userId: string, replyId: string) {
    return await prisma.like.findFirst({
      where: {
        userId,
        replyId,
      },
    });
  }

  async createLike(userId: string, postId: string) {
    return await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  async deleteLike(id: string) {
    return await prisma.like.delete({
      where: { id },
    });
  }

  async createLikeReply(userId: string, replyId: string) {
    return await prisma.like.create({
      data: {
        userId,
        replyId,
      },
    });
  }

  async deleteLikeReply(id: string) {
    return await prisma.like.delete({
      where: { id },
    });
  }

  async getLikesByUserAndPostIds(userId: string, postIds: string[]) {
    return await prisma.like.findMany({
      where: {
        userId,
        postId: {
          in: postIds,
        },
      },
      select: {
        postId: true,
      },
    });
  }
}

export default new LikeService();
