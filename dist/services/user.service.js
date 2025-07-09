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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../libs/prisma"));
class UserService {
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findMany({
                include: {
                    profile: true,
                },
            });
        });
    }
    getUsersSearch(q, currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_1.default.user.findMany({
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
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [user, followersCount, followingsCount] = yield Promise.all([
                prisma_1.default.user.findFirst({
                    where: { id },
                    include: {
                        profile: true,
                    },
                }),
                // Follower count = Berapa orang yang follow user ini (followerId = orang lain, followingId = id)
                prisma_1.default.follow.count({
                    where: {
                        followingId: id,
                        followerId: { not: id },
                    },
                }),
                // Following count = Berapa orang yang user ini follow (followerId = id, followingId = orang lain)
                prisma_1.default.follow.count({
                    where: {
                        followerId: id,
                        followingId: { not: id },
                    },
                }),
            ]);
            if (!user)
                return null;
            return Object.assign(Object.assign({}, user), { followersCount,
                followingsCount });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({
                where: { email },
                include: {
                    profile: true,
                },
            });
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.findUnique({
                where: { username },
                include: {
                    profile: true,
                    followers: true,
                    followings: true,
                },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName } = data, userData = __rest(data, ["fullName"]);
            return yield prisma_1.default.user.create({
                data: Object.assign(Object.assign({}, userData), { profile: {
                        create: {
                            fullName,
                        },
                    } }),
            });
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.delete({
                where: { id },
            });
        });
    }
    updateUserById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.user.update({
                where: { id },
                data,
            });
        });
    }
    getSuggestedUsers(currentUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestedUsers = yield prisma_1.default.user.findMany({
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
                const mutualCount = user.followers.filter((f) => f.followerId === currentUserId).length;
                return Object.assign(Object.assign({}, user), { followersCount: user.followers.length, mutualCount });
            })
                .sort((a, b) => {
                if (b.mutualCount !== a.mutualCount)
                    return b.mutualCount - a.mutualCount;
                return b.followersCount - a.followersCount;
            })
                .slice(0, 5);
            return sortedUsers;
        });
    }
}
exports.default = new UserService();
