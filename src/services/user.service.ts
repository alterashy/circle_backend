import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import prisma from "../libs/prisma";

class UserService {
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async getUsersSearch(q: string, currentUserId: string) {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: currentUserId,
            },
          },
          {
            OR: [
              {
                username: {
                  contains: q,
                  mode: "insensitive",
                },
              },
              {
                profile: {
                  fullName: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            ],
          },
        ],
      },
      include: {
        profile: true,
        followers: {
          where: {
            followerId: currentUserId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      profile: user.profile,
      isFollow: user.followers.length > 0,
    }));
  }

  async getUserById(id: string) {
    const [user, followersCount, followingsCount] = await Promise.all([
      prisma.user.findFirst({
        where: { id },
        include: {
          profile: true,
        },
      }),

      // Follower count = Berapa orang yang follow user ini (followerId = orang lain, followingId = id)
      prisma.follow.count({
        where: {
          followingId: id,
          followerId: { not: id },
        },
      }),

      // Following count = Berapa orang yang user ini follow (followerId = id, followingId = orang lain)
      prisma.follow.count({
        where: {
          followerId: id,
          followingId: { not: id },
        },
      }),
    ]);

    if (!user) return null;

    return {
      ...user,
      followersCount,
      followingsCount,
    };
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        followers: true,
        followings: true,
      },
    });
  }

  async createUser(data: CreateUserDTO) {
    const { fullName, ...userData } = data;

    return await prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            fullName,
          },
        },
      },
    });
  }

  async deleteUserById(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }

  async updateUserById(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async getSuggestedUsers(currentUserId: string) {
    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId,
        },
        followers: {
          none: {
            followerId: currentUserId,
          },
        },
      },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
        followers: {
          select: {
            followerId: true,
          },
        },
      },
    });

    const sortedUsers = suggestedUsers
      .map((user) => {
        const mutualCount = user.followers.filter(
          (f) => f.followerId === currentUserId
        ).length;
        return {
          ...user,
          followersCount: user.followers.length,
          mutualCount,
        };
      })
      .sort((a, b) => {
        if (b.mutualCount !== a.mutualCount)
          return b.mutualCount - a.mutualCount;
        return b.followersCount - a.followersCount;
      })
      .slice(0, 5);

    return sortedUsers;
  }
}

export default new UserService();
