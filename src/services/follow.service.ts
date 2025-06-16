import { CreateFollowDTO, DeleteFollowDTO } from "../dtos/follow.dto";
import { prisma } from "../libs/prisma";

class FollowService {
  async getFollowersById(userId: string) {
    return await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getFollowingsById(userId: string) {
    return await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createFollow(userId: string, followingId: string) {
    return await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: followingId,
      },
    });
  }

  async deleteFollow(id: string) {
    return await prisma.follow.delete({
      where: { id },
    });
  }
}
export default new FollowService();
