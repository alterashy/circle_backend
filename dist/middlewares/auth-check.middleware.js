"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authCheck = authCheck;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authCheck(req, res, next) {
    let token = req.headers["authorization"] || "";
    if (token.split(" ").length > 1) {
        token = token.split(" ")[1];
    }
    const jwtSecret = process.env.JWT_SECRET || "";
    const user = jsonwebtoken_1.default.verify(token, jwtSecret);
    if (!user) {
        res.status(401).json({
            message: "Unauthorized!",
        });
        return;
    }
    req.user = user;
    next();
}
