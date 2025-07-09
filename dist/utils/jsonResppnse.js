"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = void 0;
const jsonResponse = (status, code, message, data = null) => {
    return Object.assign({ status,
        code,
        message }, (data !== null && { data }));
};
exports.jsonResponse = jsonResponse;
