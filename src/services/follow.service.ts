import prisma from "../libs/prisma";

export const toggleFollow = async (
  currentUserId: string,
  targetUserId: string
) => {
  if (currentUserId === targetUserId) {
    throw new Error("Tidak bisa follow diri sendiri");
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { id: existing.id },
    });
    return { isFollow: false };
  }

  await prisma.follow.create({
    data: {
      followerId: currentUserId,
      followingId: targetUserId,
    },
  });

  return { isFollow: true };
};

export const getFollowers = async (userId: string, currentUserId: string) => {
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const currentUserFollowings = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = currentUserFollowings.map((f) => f.followingId);

  return followers.map((follow) => ({
    ...follow,
    isFollow: followingIds.includes(follow.followerId),
  }));
};

export const getFollowings = async (userId: string, currentUserId: string) => {
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const currentUserFollowings = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  const followingIds = currentUserFollowings.map((f) => f.followingId);

  return followings.map((follow) => ({
    ...follow,
    isFollow: followingIds.includes(follow.followingId),
  }));
};

export const getFollowCount = async (userId: string) => {
  const [followersCount, followingsCount] = await Promise.all([
    prisma.follow.count({
      where: {
        followingId: userId,
        followerId: { not: userId }, // ⛔ exclude self
      },
    }),
    prisma.follow.count({
      where: {
        followerId: userId,
        followingId: { not: userId }, // ⛔ exclude self
      },
    }),
  ]);

  return { followersCount, followingsCount };
};

export const getFollowSuggestions = async (
  currentUserId: string,
  limit = 5
) => {
  // Ambil semua userId yang sudah difollow
  const followed = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followingId: true },
  });

  // Buat daftar ID yang harus di-exclude (yang sudah difollow + diri sendiri)
  const excludedIds = followed.map((f) => f.followingId);
  excludedIds.push(currentUserId); // ⛔ jangan tampilkan user sendiri

  // Ambil user yang belum difollow
  const suggestions = await prisma.user.findMany({
    where: {
      id: { notIn: excludedIds },
    },
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc", // atau bisa kamu ubah ke sort populer nanti
    },
    take: limit,
  });

  return suggestions;
};
