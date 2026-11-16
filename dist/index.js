"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./configs/env");
const logger_1 = require("./configs/logger");
const mysql_1 = require("./configs/mysql");
// Imported for its side effect: initialise Firebase at startup so bad
// credentials fail immediately, not on the first message.
require("./configs/firebase");
const errorHandler_1 = require("./middlewares/errorHandler");
const notFound_1 = require("./middlewares/notFound");
const routes_1 = __importDefault(require("./routes"));
const sockets_1 = require("./sockets");
const corsOrigin = env_1.env.CORS_ORIGIN === "*" ? "*" : env_1.env.CORS_ORIGIN.split(",").map((o) => o.trim());
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: corsOrigin }));
app.use(express_1.default.json({ limit: "100kb" }));
app.use(routes_1.default);
app.use(notFound_1.notFound);
app.use(errorHandler_1.errorHandler);
const server = http_1.default.createServer(app);
const io = (0, sockets_1.initSockets)(server, corsOrigin);
const start = async () => {
    await (0, mysql_1.connectMySQL)();
    server.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`Server listening on http://localhost:${env_1.env.PORT}`);
    });
};
const shutdown = (signal) => {
    logger_1.logger.info(`${signal} received, shutting down`);
    // io.close() also closes the underlying HTTP server.
    io.close(() => {
        mysql_1.pool
            .end()
            .catch((err) => logger_1.logger.error("Error closing MySQL pool:", err))
            .finally(() => process.exit(0));
    });
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
start().catch((err) => {
    logger_1.logger.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map