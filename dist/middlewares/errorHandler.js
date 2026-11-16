"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_status_1 = require("http-status");
const logger_1 = require("../configs/logger");
const AppError_1 = require("../helpers/AppError");
// Express recognises error middleware by its 4 arguments, so `next` must stay.
const errorHandler = (err, req, res, _next) => {
    // Malformed JSON body from express.json()
    if (err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed") {
        res.status(http_status_1.status.BAD_REQUEST).json({ error: { message: "Malformed JSON body" } });
        return;
    }
    const { statusCode, message, details, expected } = (0, AppError_1.toErrorResponse)(err);
    if (!expected)
        logger_1.logger.error(`${req.method} ${req.originalUrl} failed:`, err);
    res.status(statusCode).json({ error: { message, ...(details && { details }) } });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map