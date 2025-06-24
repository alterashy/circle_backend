import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

const whitelist = ["image/png", "image/jpeg", "image/jpg"];

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || "";
const api_key = process.env.CLOUDINARY_API_KEY || "";
const api_secret = process.env.CLOUDINARY_API_SECRET || "";

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }

    cb(null, true);
  },
});
