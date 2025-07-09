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
const profile_schemas_1 = require("../schemas/profile.schemas");
const profile_service_1 = __importDefault(require("../services/profile.service"));
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = require("cloudinary");
class profileController {
    getUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield profile_service_1.default.getUserProfile(id);
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserProfileByUsername(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username } = req.params;
                const profile = yield profile_service_1.default.getUserProfileByUsername(username);
                res.json(profile);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let avatarUrl = "";
                let bannerUrl = "";
                const files = req.files;
                if ((_a = files === null || files === void 0 ? void 0 : files.avatarUrl) === null || _a === void 0 ? void 0 : _a[0]) {
                    const avatarFile = files.avatarUrl[0];
                    avatarUrl = yield new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({}, (error, result) => {
                            if (error)
                                return reject(error);
                            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                        });
                        streamifier_1.default.createReadStream(avatarFile.buffer).pipe(stream);
                    });
                }
                if ((_b = files === null || files === void 0 ? void 0 : files.bannerUrl) === null || _b === void 0 ? void 0 : _b[0]) {
                    const bannerFile = files.bannerUrl[0];
                    bannerUrl = yield new Promise((resolve, reject) => {
                        const stream = cloudinary_1.v2.uploader.upload_stream({}, (error, result) => {
                            if (error)
                                return reject(error);
                            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || "");
                        });
                        streamifier_1.default.createReadStream(bannerFile.buffer).pipe(stream);
                    });
                }
                const body = Object.assign(Object.assign({}, req.body), { avatarUrl: avatarUrl || undefined, bannerUrl: bannerUrl || undefined });
                const userId = req.user.id;
                const { value } = profile_schemas_1.updateProfileSchema.validate(body);
                const updated = yield profile_service_1.default.updateUserProfile(userId, value);
                res.json(updated);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new profileController();
