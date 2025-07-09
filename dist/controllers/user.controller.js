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
const user_schema_1 = require("../schemas/user.schema");
const user_service_1 = __importDefault(require("../services/user.service"));
const prisma_1 = __importDefault(require("../libs/prisma"));
const httpStatus_1 = require("../utils/httpStatus");
const jsonResppnse_1 = require("../utils/jsonResppnse");
class UserController {
    getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.default.getUsers();
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Users fetched", { users }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUsersSearch(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const q = req.query.q;
                const currentUserId = req.user.id;
                if (!q.trim()) {
                    res.json([]);
                    return;
                }
                const users = yield user_service_1.default.getUsersSearch(q, currentUserId);
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Users fetched", { users }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield user_service_1.default.getUserById(id);
                if (!user) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "User not found"));
                    return;
                }
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User fetched", { user }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserByUsername(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const user = yield user_service_1.default.getUserByUsername(username);
                if (!user) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "User not found"));
                    return;
                }
                const [followersCount, followingsCount] = yield Promise.all([
                    prisma_1.default.follow.count({
                        where: {
                            followerId: user === null || user === void 0 ? void 0 : user.id,
                        },
                    }),
                    prisma_1.default.follow.count({
                        where: {
                            followingId: user === null || user === void 0 ? void 0 : user.id,
                        },
                    }),
                ]);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User fetched", {
                    user,
                    followersCount,
                    followingsCount,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validatedBody = yield user_schema_1.createUserSchema.validateAsync(body);
                const user = yield user_service_1.default.createUser(validatedBody);
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User fetched", { user }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const body = req.body;
                let user = yield user_service_1.default.getUserById(id);
                if (!user) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "User not found"));
                    return;
                }
                const { email, username } = yield user_schema_1.updateUserSchema.validateAsync(body);
                if (email != "") {
                    user.email = email;
                }
                if (username != "") {
                    user.username = username;
                }
                const updatedUser = yield user_service_1.default.updateUserById(id, user);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Profile updated", {
                    updatedUser,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield user_service_1.default.deleteUserById(id);
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User deleted", { user }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getSuggestedUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUserId = req.user.id;
                const users = yield user_service_1.default.getSuggestedUsers(currentUserId);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Sugested users fetched", {
                    users,
                }));
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = new UserController();
