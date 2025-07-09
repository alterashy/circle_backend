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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = require("../libs/nodemailer");
const auth_schema_1 = require("../schemas/auth.schema");
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const httpStatus_1 = require("../utils/httpStatus");
const jsonResppnse_1 = require("../utils/jsonResppnse");
class AuthController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { email, password } = yield auth_schema_1.loginSchema.validateAsync(body);
                const user = yield user_service_1.default.getUserByEmail(email);
                if (!user) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "Incorrect email"));
                    return;
                }
                const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isPasswordMatch) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "Incorrect password"));
                    return;
                }
                const jwtSecret = process.env.JWT_SECRET || "";
                const token = jsonwebtoken_1.default.sign({ id: user.id }, jwtSecret, {
                    expiresIn: "2 days",
                });
                const { password: unusedPassword } = user, userResponse = __rest(user, ["password"]);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Logged in", {
                    user: userResponse,
                    token,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const validatedBody = yield auth_schema_1.registerSchema.validateAsync(body);
                const hashedPassword = yield bcrypt_1.default.hash(validatedBody.password, 10);
                const registerBody = Object.assign(Object.assign({}, validatedBody), { password: hashedPassword });
                const user = yield auth_service_1.default.register(registerBody);
                res.status(httpStatus_1.HttpStatus.CREATED).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.CREATED, "Account registered", {
                    user,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    check(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.user;
                const user = yield user_service_1.default.getUserById(payload.id);
                if (!user) {
                    res.status(404).json({
                        message: "User not found!",
                    });
                    return;
                }
                const { password: unusedPassword } = user, userResponse = __rest(user, ["password"]);
                res.status(200).json({
                    message: "User check success!",
                    data: Object.assign({}, userResponse),
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { email } = yield auth_schema_1.forgotPasswordSchema.validateAsync(body);
                const jwtSecret = process.env.JWT_SECRET || "";
                const token = jsonwebtoken_1.default.sign({ email }, jwtSecret, {
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
                yield nodemailer_1.transporter.sendMail(mailOptions);
                res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Email sent"));
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.user;
                const body = req.body;
                const { oldPassword, newPassword } = yield auth_schema_1.resetPasswordSchema.validateAsync(body);
                if (oldPassword === newPassword) {
                    res
                        .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.BAD_REQUEST, "New password must be different from old password"));
                    return;
                }
                const user = yield user_service_1.default.getUserByEmail(payload.email);
                if (!user) {
                    res
                        .status(httpStatus_1.HttpStatus.NOT_FOUND)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.NOT_FOUND, "User not found"));
                    return;
                }
                const isOldPasswordCorrect = yield bcrypt_1.default.compare(oldPassword, user.password);
                if (!isOldPasswordCorrect) {
                    res
                        .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                        .json((0, jsonResppnse_1.jsonResponse)("error", httpStatus_1.HttpStatus.BAD_REQUEST, "Old password is incorrect"));
                    return;
                }
                const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
                const _a = yield auth_service_1.default.resetPassword(user.email, hashedNewPassword), { password } = _a, updatedUserPassword = __rest(_a, ["password"]);
                res.status(httpStatus_1.HttpStatus.OK).json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "Password updated", {
                    user: updatedUserPassword,
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new AuthController();
