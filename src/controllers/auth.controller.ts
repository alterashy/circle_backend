import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RegisterDTO } from "../dtos/auth.dto";
import { transporter } from "../libs/nodemailer";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import {
	forgotPasswordSchema,
	loginSchema,
	registerSchema,
	resetPasswordSchema,
} from "../schemas/auth.schema";

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
               required: true,
               content: {
                   "application/json": {
                       schema: {
                           $ref: "#/components/schemas/LoginDTO"
                       }
                   }
               }
           }
       */

		try {
			const body = req.body;
			const { email, password } = await loginSchema.validateAsync(body);
			const user = await userService.getUserByEmail(email);

			if (!user) {
				res.status(404).json({
					message: "Email/password is wrong!",
				});
				return;
			}

			const isPasswordMatch = await bcrypt.compare(password, user.password);

			if (!isPasswordMatch) {
				res.status(404).json({
					message: "Email/password is wrong!",
				});
				return;
			}

			const jwtSecret = process.env.JWT_SECRET || "";

			const token = jwt.sign(
				{
					id: user.id,
				},
				jwtSecret,
				{
					expiresIn: "2 days",
				}
			);

			const { password: unusedPassword, ...userResponse } = user;

			res.status(200).json({
				message: "Login success!",
				data: {
					user: userResponse,
					token,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async register(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/RegisterDTO"
                      }
                  }
              }
          }
      */
		try {
			const body = req.body;
			const validatedBody = await registerSchema.validateAsync(body);
			const hashedPassword = await bcrypt.hash(validatedBody.password, 10);

			const registerBody: RegisterDTO = {
				...validatedBody,
				password: hashedPassword,
			};

			const user = await authService.register(registerBody);
			res.status(200).json({
				message: "Register success!",
				data: { ...user },
			});
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
		/*  #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          $ref: "#/components/schemas/ForgotPasswordDTO"
                      }
                  }
              }
          }
      */
		try {
			const body = req.body;
			const { email } = await forgotPasswordSchema.validateAsync(body);

			const jwtSecret = process.env.JWT_SECRET || "";

			const token = jwt.sign({ email }, jwtSecret, {
				expiresIn: "2 days",
			});

			const frontendUrl = process.env.FRONTEND_BASE_URL || "";
			const resetPasswordLink = `${frontendUrl}/reset-password?token=${token}`;

			const mailOptions = {
				from: "suryaelidanto@gmail.com",
				to: email,
				subject: "Circe | Forgot Password",
				html: `
        <h1>This is link for reset password:</h1>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        `,
			};

			await transporter.sendMail(mailOptions);
			res.status(200).json({
				message: "Forgot password link sent!",
			});
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req: Request, res: Response, next: NextFunction) {
		/*  #swagger.requestBody = {
                  required: true,
                  content: {
                      "application/json": {
                          schema: {
                              $ref: "#/components/schemas/ResetPasswordDTO"
                          }
                      }
                  }
              }
          */

		try {
			const payload = (req as any).user;
			const body = req.body;
			const { oldPassword, newPassword } = await resetPasswordSchema.validateAsync(body);

			if (oldPassword === newPassword) {
				res.status(400).json({
					message: "Password cannot be the same as previous!",
				});
				return;
			}

			const user = await userService.getUserByEmail(payload.email);

			if (!user) {
				res.status(404).json({
					message: "User not found!",
				});
				return;
			}

			const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

			if (!isOldPasswordCorrect) {
				res.status(400).json({
					message: "Old password is not correct!",
				});
				return;
			}

			const hashedNewPassword = await bcrypt.hash(newPassword, 10);

			const { password, ...updatedUserPassword } = await authService.resetPassword(
				user.email,
				hashedNewPassword
			);

			res.status(200).json({
				message: "Reset password success!",
				data: { ...updatedUserPassword },
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new AuthController();
