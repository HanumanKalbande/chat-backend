"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const http_status_1 = require("http-status");
const notFound = (req, res) => {
    res.status(http_status_1.status.NOT_FOUND).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
};
exports.notFound = notFound;
//# sourceMappingURL=notFound.js.map