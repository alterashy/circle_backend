"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const client_1 = require("@prisma/client");
const joi_1 = __importDefault(require("joi"));
function errorHandler(err, req, res, next) {
    if (err instanceof joi_1.default.ValidationError) {
        res.status(400).json({
            message: err.details[0].message,
        });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        res.status(400).json({
            message: err.message,
        });
        return;
    }
    res.status(500).json({ message: `Internal Server Error! Error: ${JSON.stringify(err)}` });
}
