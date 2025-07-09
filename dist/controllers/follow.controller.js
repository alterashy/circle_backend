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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowSuggestionsController = exports.getFollowCountController = exports.getFollowingsController = exports.getFollowersController = exports.toggleFollowController = void 0;
const follow_schema_1 = require("../schemas/follow.schema");
const follow_service_1 = require("../services/follow.service");
const httpStatus_1 = require("../utils/httpStatus");
const jsonResppnse_1 = require("../utils/jsonResppnse");
const toggleFollowController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = follow_schema_1.toggleFollowSchema.validate(req.body);
    if (error) {
        res
            .status(httpStatus_1.HttpStatus.BAD_REQUEST)
            .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.BAD_REQUEST, error.message, null));
        return;
    }
    const currentUserId = req.user.id;
    const targetUserId = value.userId;
    try {
        const result = yield (0, follow_service_1.toggleFollow)(currentUserId, targetUserId);
        res.json(result);
    }
    catch (err) {
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to Follow/Unfollow", null));
    }
});
exports.toggleFollowController = toggleFollowController;
const getFollowersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        const followers = yield (0, follow_service_1.getFollowers)(userId, currentUserId);
        res
            .status(httpStatus_1.HttpStatus.OK)
            .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Followers retrieved successfully", followers));
    }
    catch (err) {
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve Followers", null));
    }
});
exports.getFollowersController = getFollowersController;
const getFollowingsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const currentUserId = req.user.id;
    try {
        const followings = yield (0, follow_service_1.getFollowings)(userId, currentUserId);
        res
            .status(httpStatus_1.HttpStatus.OK)
            .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Followings retrieved successfully", followings));
    }
    catch (err) {
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve Followings", null));
    }
});
exports.getFollowingsController = getFollowingsController;
const getFollowCountController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const counts = yield (0, follow_service_1.getFollowCount)(userId);
        res.status(httpStatus_1.HttpStatus.OK).json({
            status: "success",
            code: httpStatus_1.HttpStatus.OK,
            message: "Follow counts retrieved successfully",
            data: counts,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getFollowCountController = getFollowCountController;
const getFollowSuggestionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.user.id;
    try {
        const suggestions = yield (0, follow_service_1.getFollowSuggestions)(currentUserId);
        res
            .status(httpStatus_1.HttpStatus.OK)
            .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Follow suggestions retrieved successfully", { suggestions }));
    }
    catch (error) {
        res
            .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
            .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve follow suggestions", null));
    }
});
exports.getFollowSuggestionsController = getFollowSuggestionsController;
