"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../libs/prisma"));
class ThreadService {
    getAllPosts(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.post.findMany({
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
                take: pagination === null || pagination === void 0 ? void 0 : pagination.limit,
                skip: pagination === null || pagination === void 0 ? void 0 : pagination.startIndex,
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    countAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.post.count();
        });
    }
    getFeedPosts(currentUserId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const followings = yield prisma_1.default.follow.findMany({
                where: { followerId: currentUserId },
                select: { followingId: true },
            });
            const followingIds = followings.map((f) => f.followingId);
            return yield prisma_1.default.post.findMany({
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
                take: pagination === null || pagination === void 0 ? void 0 : pagination.limit,
                skip: pagination === null || pagination === void 0 ? void 0 : pagination.startIndex,
                orderBy: {
                    createdAt: "desc",
                },
            });
        });
    }
    getPostsByUser(targetUserId, currentUserId, pagination, hasImage) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield prisma_1.default.post.findMany({
                where: Object.assign({ userId: targetUserId }, (hasImage ? { images: { not: null } } : {})),
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
                take: pagination === null || pagination === void 0 ? void 0 : pagination.limit,
                skip: pagination === null || pagination === void 0 ? void 0 : pagination.startIndex,
                orderBy: {
                    createdAt: "desc",
                },
            });
            const likedSet = new Set(posts
                .flatMap((p) => p.likes)
                .filter((like) => like.userId === currentUserId)
                .map((like) => like.userId + like.postId));
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
        });
    }
    getPostsByUsername(targetUsername, currentUserId, pagination, hasImage) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield prisma_1.default.post.findMany({
                where: {
                    user: Object.assign({ username: targetUsername }, (hasImage ? { images: { not: null } } : {})),
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
                take: pagination === null || pagination === void 0 ? void 0 : pagination.limit,
                skip: pagination === null || pagination === void 0 ? void 0 : pagination.startIndex,
                orderBy: {
                    createdAt: "desc",
                },
            });
            const likedSet = new Set(posts
                .flatMap((p) => p.likes)
                .filter((like) => like.userId === currentUserId)
                .map((like) => like.userId + like.postId));
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
        });
    }
    getPostById(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma_1.default.post.findUnique({
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
            const likesCount = yield prisma_1.default.like.count({ where: { postId } });
            const repliesCount = yield prisma_1.default.reply.count({ where: { postId } });
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
                replies: post.replies.map((reply) => {
                    var _a;
                    return ({
                        id: reply.id,
                        content: reply.content,
                        images: reply.images,
                        isEdited: reply.isEdited,
                        createdAt: reply.createdAt,
                        updatedAt: reply.updatedAt,
                        user: reply.user,
                        likesCount: ((_a = reply.likes) === null || _a === void 0 ? void 0 : _a.length) || 0,
                        isLiked: userId ? reply.likes.length > 0 : false,
                    });
                }),
            };
        });
    }
    getExplorePosts(currentUserId, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield prisma_1.default.post.findMany({
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
                take: pagination === null || pagination === void 0 ? void 0 : pagination.limit,
                skip: pagination === null || pagination === void 0 ? void 0 : pagination.startIndex,
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
        });
    }
    createPost(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, images } = data;
            return yield prisma_1.default.post.create({
                data: {
                    images,
                    content,
                    userId,
                },
            });
        });
    }
    updatePost(postId, userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma_1.default.post.findUnique({ where: { id: postId } });
            if (!post || post.userId !== userId) {
                throw new Error("Post not found or unauthorized");
            }
            return prisma_1.default.post.update({
                where: { id: postId },
                data: Object.assign(Object.assign({}, dto), { isEdited: true }),
            });
        });
    }
    deletePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield prisma_1.default.post.findFirst({
                where: { id: postId, userId },
            });
            if (!post) {
                throw new Error("Post not found or unauthorized");
            }
            yield prisma_1.default.reply.deleteMany({
                where: { postId },
            });
            yield prisma_1.default.like.deleteMany({
                where: { postId },
            });
            return yield prisma_1.default.post.delete({
                where: { id: postId },
            });
        });
    }
}
exports.default = new ThreadService();
