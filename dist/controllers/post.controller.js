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
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const post_schema_1 = require("../schemas/post.schema");
const like_service_1 = __importDefault(require("../services/like.service"));
const post_service_1 = __importDefault(require("../services/post.service"));
const httpStatus_1 = require("../utils/httpStatus");
const jsonResppnse_1 = require("../utils/jsonResppnse");
class PostController {
    constructor() {
        this.getAllPosts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const startIndex = (page - 1) * limit;
                const userId = req.user.id;
                const pagination = { limit, startIndex };
                const [posts, totalPosts] = yield Promise.all([
                    post_service_1.default.getAllPosts(pagination),
                    post_service_1.default.countAllPosts(),
                ]);
                const postIds = posts.map((post) => post.id);
                const userLikes = yield like_service_1.default.getLikesByUserAndPostIds(userId, postIds);
                const likedPostSet = new Set(userLikes.map((like) => like.postId));
                const newPosts = posts.map((post) => ({
                    id: post.id,
                    content: post.content,
                    images: post.images,
                    createdAt: post.createdAt,
                    isEdited: post.isEdited,
                    user: post.user,
                    likesCount: post._count.likes,
                    repliesCount: post._count.replies,
                    isLiked: likedPostSet.has(post.id),
                }));
                const hasNextPage = startIndex + posts.length < totalPosts;
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "All posts fetched", {
                    posts: newPosts,
                    pagination: {
                        page,
                        limit,
                        total: totalPosts,
                        hasNextPage,
                    },
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getFeedPosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const startIndex = (page - 1) * limit;
                const pagination = { page, limit, startIndex };
                const currentUserId = req.user.id;
                const posts = yield post_service_1.default.getFeedPosts(currentUserId, pagination);
                const postIds = posts.map((p) => p.id);
                const likedPosts = yield like_service_1.default.getLikesByUserAndPostIds(currentUserId, postIds);
                const likedPostSet = new Set(likedPosts.map((like) => like.postId));
                const result = posts.map((post) => (Object.assign(Object.assign({}, post), { likesCount: post.likes.length, repliesCount: post.replies.length, isLiked: likedPostSet.has(post.id) })));
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Feed posts fetched", {
                    posts: result,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.id;
                const currentUserId = req.user.id;
                const post = yield post_service_1.default.getPostById(postId, currentUserId);
                if (!post) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "Post not found"));
                    return;
                }
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Post fetched", { post }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostsByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const targetUserId = req.params.userId;
                const currentUserId = req.user.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const startIndex = (page - 1) * limit;
                const hasImage = req.query.hasImage === "true";
                const posts = yield post_service_1.default.getPostsByUser(targetUserId, currentUserId, { limit, startIndex }, hasImage);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User posts fetched", {
                    posts,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPostsByUsername(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const targetUsername = req.params.username;
                const currentUserId = req.user.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const startIndex = (page - 1) * limit;
                const hasImage = req.query.hasImage === "true";
                const posts = yield post_service_1.default.getPostsByUsername(targetUsername, currentUserId, { limit, startIndex }, hasImage);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "User posts fetched", {
                    posts,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getExplorePosts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const startIndex = (page - 1) * limit;
                const pagination = { limit, startIndex };
                const posts = yield post_service_1.default.getExplorePosts(userId, pagination);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Explore posts fetched", {
                    posts,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    createPost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = "";
                if (req.file) {
                    imageUrl = yield new Promise((resolve, reject) => {
                        if (req.file) {
                            try {
                                const stream = cloudinary_1.v2.uploader.upload_stream({}, (error, result) => {
                                    if (error)
                                        return console.error(error);
                                    resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                                });
                                streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                            }
                            catch (error) {
                                reject(error);
                            }
                        }
                    });
                }
                const body = Object.assign(Object.assign({}, req.body), { images: imageUrl || undefined });
                const userId = req.user.id;
                const validatedBody = yield post_schema_1.createThreadSchema.validateAsync(body);
                const post = yield post_service_1.default.createPost(userId, validatedBody);
                res.json({
                    message: "Post created",
                    data: Object.assign({}, post),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updatePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageUrl = "";
            if (req.file) {
                imageUrl = yield new Promise((resolve, reject) => {
                    if (req.file) {
                        try {
                            const stream = cloudinary_1.v2.uploader.upload_stream({}, (error, result) => {
                                if (error)
                                    return console.error(error);
                                resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                            });
                            streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                        }
                        catch (error) {
                            reject(error);
                        }
                    }
                });
            }
            const body = Object.assign(Object.assign({}, req.body), { images: imageUrl || undefined });
            const validatedBody = yield post_schema_1.updateThreadSchema.validateAsync(body);
            const userId = req.user.id;
            const postId = req.params.id;
            try {
                const updated = yield post_service_1.default.updatePost(postId, userId, validatedBody);
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Post updated", { updated }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    deletePost(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const postId = req.params.id;
            try {
                const deleted = yield post_service_1.default.deletePost(postId, userId);
                res.json(deleted);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new PostController();
