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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class profileService {
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.profile.findUnique({
                where: { userId },
            });
        });
    }
    getUserProfileByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.user.findUnique({
                include: { profile: true },
                where: { username },
            });
        });
    }
    updateUserProfile(userId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield prisma.profile.findUnique({ where: { userId } });
            if (!profile)
                throw new Error("Profile not found");
            const { username } = dto, profileData = __rest(dto, ["username"]);
            if (username) {
                const existingUser = yield prisma.user.findUnique({
                    where: { username },
                });
                if (existingUser && existingUser.id !== userId) {
                    throw new Error("Username already taken");
                }
            }
            const [updatedUser, updatedProfile] = yield prisma.$transaction([
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
                    id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.id,
                    username: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.username,
                },
                profile: updatedProfile,
            };
        });
    }
}
exports.default = new profileService();
