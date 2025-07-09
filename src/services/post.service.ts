import { CreateThreadDTO, UpdateThreadDTO } from "../dtos/post.dto";
import prisma from "../libs/prisma";

class ThreadService {
  async getAllPosts(pagination?: { limit: number; startIndex: number }) {
    return await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        images: true,
        createdAt: true,
        isEdited: true,
        userId: true,
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
                bio: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async countAllPosts() {
    return await prisma.post.count();
  }

  async getFeedPosts(
    currentUserId: string,
    pagination?: { limit: number; startIndex: number }
  ) {
    const followings = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingIds = followings.map((f) => f.followingId);

    return await prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        replies: {
          select: {
            id: true,
          },
        },
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getPostsByUser(
    targetUserId: string,
    currentUserId: string,
    pagination?: { limit: number; startIndex: number },
    hasImage?: boolean
  ) {
    const posts = await prisma.post.findMany({
      where: {
        userId: targetUserId,
        ...(hasImage ? { images: { not: null } } : {}),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
            postId: true,
          },
        },
        replies: {
          select: {
            id: true,
          },
        },
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
      orderBy: {
        createdAt: "desc",
      },
    });

    const likedSet = new Set(
      posts
        .flatMap((p) => p.likes)
        .filter((like) => like.userId === currentUserId)
        .map((like) => like.userId + like.postId)
    );

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      images: post.images,
      isEdited: post.isEdited,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        profile: post.user.profile,
      },
      likesCount: post.likes.length,
      repliesCount: post.replies.length,
      isLiked: post.likes.some((like) => like.userId === currentUserId),
    }));
  }

  async getPostsByUsername(
    targetUsername: string,
    currentUserId: string,
    pagination?: { limit: number; startIndex: number },
    hasImage?: boolean
  ) {
    const posts = await prisma.post.findMany({
      where: {
        user: {
          username: targetUsername,
          ...(hasImage ? { images: { not: null } } : {}),
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
            postId: true,
          },
        },
        replies: {
          select: {
            id: true,
          },
        },
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
      orderBy: {
        createdAt: "desc",
      },
    });

    const likedSet = new Set(
      posts
        .flatMap((p) => p.likes)
        .filter((like) => like.userId === currentUserId)
        .map((like) => like.userId + like.postId)
    );

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      images: post.images,
      isEdited: post.isEdited,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        profile: post.user.profile,
      },
      likesCount: post.likes.length,
      repliesCount: post.replies.length,
      isLiked: post.likes.some((like) => like.userId === currentUserId),
    }));
  }

  async getPostById(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            likes: userId
              ? {
                  where: { userId },
                  select: { id: true },
                }
              : false,
          },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const likesCount = await prisma.like.count({ where: { postId } });
    const repliesCount = await prisma.reply.count({ where: { postId } });

    const isLiked = userId ? post.likes.length > 0 : false;

    return {
      id: post.id,
      content: post.content,
      images: post.images,
      isEdited: post.isEdited,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      likesCount,
      repliesCount,
      isLiked,
      replies: post.replies.map((reply) => ({
        id: reply.id,
        content: reply.content,
        images: reply.images,
        isEdited: reply.isEdited,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        user: reply.user,
        likesCount: reply.likes?.length || 0,
        isLiked: userId ? reply.likes.length > 0 : false,
      })),
    };
  }

  async getExplorePosts(
    currentUserId: string,
    pagination?: { limit: number; startIndex: number }
  ) {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        likes: {
          select: {
            userId: true,
            postId: true,
          },
        },
        replies: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pagination?.limit,
      skip: pagination?.startIndex,
    });

    return posts.map((post) => ({
      id: post.id,
      content: post.content,
      images: post.images,
      isEdited: post.isEdited,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        username: post.user.username,
        profile: post.user.profile,
      },
      likesCount: post.likes.length,
      repliesCount: post.replies.length,
      isLiked: post.likes.some((like) => like.userId === currentUserId),
    }));
  }

  async createPost(userId: string, data: CreateThreadDTO) {
    const { content, images } = data;
    return await prisma.post.create({
      data: {
        images,
        content,
        userId,
      },
    });
  }

  async updatePost(postId: string, userId: string, dto: UpdateThreadDTO) {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) {
      throw new Error("Post not found or unauthorized");
    }

    return prisma.post.update({
      where: { id: postId },
      data: {
        ...dto,
        isEdited: true,
      },
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await prisma.post.findFirst({
      where: { id: postId, userId },
    });

    if (!post) {
      throw new Error("Post not found or unauthorized");
    }

    await prisma.reply.deleteMany({
      where: { postId },
    });

    await prisma.like.deleteMany({
      where: { postId },
    });

    return await prisma.post.delete({
      where: { id: postId },
    });
  }
}

export default new ThreadService();
