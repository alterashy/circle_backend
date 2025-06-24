import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";
import { prisma } from "../libs/prisma";

class FollowService {
  async getFollowersById(userId: string) {
    return await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          include: { profile: true },
        },
      },
    });
  }

  async getFollowingsById(userId: string) {
    return await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          include: { profile: true },
        },
      },
    });
  }

  async createFollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existingFollow) {
      throw new Error("Already following");
    }

    return prisma.follow.create({
      data: { followerId, followingId },
    });
  }

  async deleteFollow(followerId: string, followingId: string) {
    return prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async checkFollow(userId: string, followingId: string) {
    return await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: followingId,
      },
    });
  }
}

export default new FollowService();
