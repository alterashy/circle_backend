"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
const whitelist = ["image/png", "image/jpeg", "image/jpg"];
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "";
const api_key = process.env.CLOUDINARY_API_KEY || "";
const api_secret = process.env.CLOUDINARY_API_SECRET || "";
cloudinary_1.v2.config({
    cloud_name,
    api_key,
    api_secret,
});
const storage = multer_1.default.memoryStorage();
exports.uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error("file is not allowed"));
        }
        cb(null, true);
    },
});
