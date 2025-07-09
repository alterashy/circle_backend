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
exports.getFollowSuggestions = exports.getFollowCount = exports.getFollowings = exports.getFollowers = exports.toggleFollow = void 0;
const prisma_1 = __importDefault(require("../libs/prisma"));
const toggleFollow = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUserId === targetUserId) {
        throw new Error("Tidak bisa follow diri sendiri");
    }
    const existing = yield prisma_1.default.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });
    if (existing) {
        yield prisma_1.default.follow.delete({
            where: { id: existing.id },
        });
        return { isFollow: false };
    }
    yield prisma_1.default.follow.create({
        data: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    });
    return { isFollow: true };
});
exports.toggleFollow = toggleFollow;
const getFollowers = (userId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const followers = yield prisma_1.default.follow.findMany({
        where: { followingId: userId },
        include: {
            follower: {
                include: { profile: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    const currentUserFollowings = yield prisma_1.default.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
    });
    const followingIds = currentUserFollowings.map((f) => f.followingId);
    return followers.map((follow) => (Object.assign(Object.assign({}, follow), { isFollow: followingIds.includes(follow.followerId) })));
});
exports.getFollowers = getFollowers;
const getFollowings = (userId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const followings = yield prisma_1.default.follow.findMany({
        where: { followerId: userId },
        include: {
            following: {
                include: { profile: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    const currentUserFollowings = yield prisma_1.default.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
    });
    const followingIds = currentUserFollowings.map((f) => f.followingId);
    return followings.map((follow) => (Object.assign(Object.assign({}, follow), { isFollow: followingIds.includes(follow.followingId) })));
});
exports.getFollowings = getFollowings;
const getFollowCount = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [followersCount, followingsCount] = yield Promise.all([
        prisma_1.default.follow.count({
            where: {
                followingId: userId,
                followerId: { not: userId }, // ⛔ exclude self
            },
        }),
        prisma_1.default.follow.count({
            where: {
                followerId: userId,
                followingId: { not: userId }, // ⛔ exclude self
            },
        }),
    ]);
    return { followersCount, followingsCount };
});
exports.getFollowCount = getFollowCount;
const getFollowSuggestions = (currentUserId_1, ...args_1) => __awaiter(void 0, [currentUserId_1, ...args_1], void 0, function* (currentUserId, limit = 5) {
    // Ambil semua userId yang sudah difollow
    const followed = yield prisma_1.default.follow.findMany({
        where: { followerId: currentUserId },
        select: { followingId: true },
    });
    // Buat daftar ID yang harus di-exclude (yang sudah difollow + diri sendiri)
    const excludedIds = followed.map((f) => f.followingId);
    excludedIds.push(currentUserId); // ⛔ jangan tampilkan user sendiri
    // Ambil user yang belum difollow
    const suggestions = yield prisma_1.default.user.findMany({
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
});
exports.getFollowSuggestions = getFollowSuggestions;
