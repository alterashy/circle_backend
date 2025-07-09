"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const httpStatus_1 = require("../utils/httpStatus");
const jsonResppnse_1 = require("../utils/jsonResppnse");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res
        .status(httpStatus_1.HttpStatus.OK)
        .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "CIRCLE API is working properly"));
});
router.post("/", (req, res) => {
    res
        .status(httpStatus_1.HttpStatus.OK)
        .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "POST API is working properly"));
});
router.patch("/", (req, res) => {
    res
        .status(httpStatus_1.HttpStatus.OK)
        .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "PATCH API is working properly"));
});
router.delete("/", (req, res) => {
    res
        .status(httpStatus_1.HttpStatus.OK)
        .json((0, jsonResppnse_1.jsonResponse)("success", httpStatus_1.HttpStatus.OK, "DELETE API is working properly"));
});
exports.default = router;
