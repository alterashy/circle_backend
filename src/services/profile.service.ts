import { PrismaClient } from "@prisma/client";
import { UpdateProfileDTO } from "../dtos/profile.dto";

const prisma = new PrismaClient();

class profileService {
  async getUserProfile(userId: string) {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async getUserProfileByUsername(username: string) {
    return await prisma.user.findUnique({
      include: { profile: true },
      where: { username },
    });
  }

  async updateUserProfile(userId: string, dto: UpdateProfileDTO) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new Error("Profile not found");

    const { username, ...profileData } = dto;

    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new Error("Username already taken");
      }
    }

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      username
        ? prisma.user.update({
            where: { id: userId },
            data: { username },
          })
        : prisma.user.findUnique({ where: { id: userId } }),

      prisma.profile.update({
        where: { userId },
        data: profileData,
      }),
    ]);

    return {
      user: {
        id: updatedUser?.id,
        username: updatedUser?.username,
      },
      profile: updatedProfile,
    };
  }
}

export default new profileService();
