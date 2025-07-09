import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RegisterDTO } from "../dtos/auth.dto";
import { transporter } from "../libs/nodemailer";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { HttpStatus } from "../utils/httpStatus";
import { jsonResponse } from "../utils/jsonResppnse";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userService.getUserByEmail(email);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "Incorrect email"));

        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(
            jsonResponse("error", HttpStatus.NOT_FOUND, "Incorrect password")
          );

        return;
      }

      const jwtSecret = process.env.JWT_SECRET || "";
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "2 days",
      });

      const { password: unusedPassword, ...userResponse } = user;

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Logged in", {
          user: userResponse,
          token,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const validatedBody = await registerSchema.validateAsync(body);
      const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

      const registerBody: RegisterDTO = {
        ...validatedBody,
        password: hashedPassword,
      };

      const user = await authService.register(registerBody);
      res.status(HttpStatus.CREATED).json(
        jsonResponse("success", HttpStatus.CREATED, "Account registered", {
          user,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      const user = await userService.getUserById(payload.id);

      if (!user) {
        res.status(404).json({
          message: "User not found!",
        });
        return;
      }

      const { password: unusedPassword, ...userResponse } = user;

      res.status(200).json({
        message: "User check success!",
        data: { ...userResponse },
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const { email } = await forgotPasswordSchema.validateAsync(body);

      const jwtSecret = process.env.JWT_SECRET || "";

      const token = jwt.sign({ email }, jwtSecret, {
        expiresIn: "2 days",
      });

      const frontendUrl = process.env.FRONTEND_BASE_URL || "";
      const resetPasswordLink = `${frontendUrl}/password/reset/${token}`;

      const mailOptions = {
        from: "maulayasyifa.mail@gmail.com",
        to: email,
        subject: "Circe | Forgot Password",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #00c951;">Circe Password Reset</h2>
        <p>Hello,</p>
        <p>You recently requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetPasswordLink}" 
        style="display: inline-block; margin: 16px 0; padding: 12px 20px; background-color: #00c951; color: #fff; text-decoration: none; border-radius: 6px;">
        Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        </p>
        <hr style="margin: 32px 0;" />
        <p style="font-size: 14px; color: #888;">
        If you didn't request this, you can safely ignore this email.
        </p>
        <p style="font-size: 14px; color: #888;">– Circe Team</p>
        </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res
        .status(HttpStatus.OK)
        .json(jsonResponse("success", HttpStatus.OK, "Email sent"));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      const body = req.body;
      const { oldPassword, newPassword } =
        await resetPasswordSchema.validateAsync(body);

      if (oldPassword === newPassword) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            jsonResponse(
              "error",
              HttpStatus.BAD_REQUEST,
              "New password must be different from old password"
            )
          );
        return;
      }

      const user = await userService.getUserByEmail(payload.email);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json(jsonResponse("error", HttpStatus.NOT_FOUND, "User not found"));
        return;
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isOldPasswordCorrect) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            jsonResponse(
              "error",
              HttpStatus.BAD_REQUEST,
              "Old password is incorrect"
            )
          );
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      const { password, ...updatedUserPassword } =
        await authService.resetPassword(user.email, hashedNewPassword);

      res.status(HttpStatus.OK).json(
        jsonResponse("success", HttpStatus.OK, "Password updated", {
          user: updatedUserPassword,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
