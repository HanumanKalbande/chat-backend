"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toErrorResponse = exports.AppError = void 0;
const http_status_1 = require("http-status");
const zod_1 = require("zod");
/** An expected error that should reach the client with a specific HTTP status. */
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
    static badRequest(message) {
        return new AppError(http_status_1.status.BAD_REQUEST, message);
    }
    static forbidden(message) {
        return new AppError(http_status_1.status.FORBIDDEN, message);
    }
    static notFound(message) {
        return new AppError(http_status_1.status.NOT_FOUND, message);
    }
    static conflict(message) {
        return new AppError(http_status_1.status.CONFLICT, message);
    }
}
exports.AppError = AppError;
/** Maps any thrown value to a client-safe response. Shared by HTTP and sockets. */
const toErrorResponse = (err) => {
    if (err instanceof AppError) {
        return { statusCode: err.statusCode, message: err.message, expected: true };
    }
    if (err instanceof zod_1.ZodError) {
        const details = {};
        for (const issue of err.issues) {
            // Drop the leading "body"/"params"/"query" so clients see the field name.
            const key = issue.path.slice(issue.path.length > 1 ? 1 : 0).join(".") || "input";
            (details[key] ??= []).push(issue.message);
        }
        return { statusCode: http_status_1.status.BAD_REQUEST, message: "Validation failed", details, expected: true };
    }
    // Never leak internal error messages (SQL, credentials, stack) to clients.
    return { statusCode: http_status_1.status.INTERNAL_SERVER_ERROR, message: "Internal server error", expected: false };
};
exports.toErrorResponse = toErrorResponse;
//# sourceMappingURL=AppError.js.map