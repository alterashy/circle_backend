import { NextFunction, Request, Response } from "express";
import { updateProfileSchema } from "../schemas/profile.schemas";
import profileService from "../services/profile.service";
import streamifier from "streamifier";
import { v2 as cloudinary, UploadStream } from "cloudinary";

class profileController {
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await profileService.getUserProfile(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUserProfileByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username } = req.params;
      const profile = await profileService.getUserProfileByUsername(username);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
              required: true,
              content: {
                  "multipart/form-data": {
                      schema: {
                          $ref: "#/components/schemas/UpdateProfiledDTO"
                      }  
                  }
              }
          } 
      */

    try {
      let avatarUrl: string = "";
      let bannerUrl: string = "";

      const files = req.files as {
        avatarUrl?: Express.Multer.File[];
        bannerUrl?: Express.Multer.File[];
      };

      if (files?.avatarUrl?.[0]) {
        const avatarFile = files.avatarUrl[0];
        avatarUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {},
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || "");
            }
          );
          streamifier.createReadStream(avatarFile.buffer).pipe(stream);
        });
      }

      if (files?.bannerUrl?.[0]) {
        const bannerFile = files.bannerUrl[0];
        bannerUrl = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {},
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || "");
            }
          );
          streamifier.createReadStream(bannerFile.buffer).pipe(stream);
        });
      }

      const body = {
        ...req.body,
        avatarUrl: avatarUrl || undefined,
        bannerUrl: bannerUrl || undefined,
      };

      const userId = (req as any).user.id;
      const { value } = updateProfileSchema.validate(body);
      const updated = await profileService.updateUserProfile(userId, value);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
}

export default new profileController();
