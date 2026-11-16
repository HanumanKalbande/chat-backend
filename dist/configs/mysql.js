"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMySQL = exports.pool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
const logger_1 = require("./logger");
exports.pool = promise_1.default.createPool({
    host: env_1.env.MYSQL_HOST,
    port: env_1.env.MYSQL_PORT,
    user: env_1.env.MYSQL_USER,
    password: env_1.env.MYSQL_PASSWORD,
    database: env_1.env.MYSQL_DATABASE,
    connectionLimit: 10,
    // Read DATETIME values as UTC so timestamps don't shift with the server's timezone.
    timezone: "Z",
});
// Make CURRENT_TIMESTAMP defaults write UTC too.
exports.pool.pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+00:00'");
});
const connectMySQL = async () => {
    await exports.pool.query("SELECT 1");
    logger_1.logger.info(`MySQL connected (${env_1.env.MYSQL_HOST}:${env_1.env.MYSQL_PORT}/${env_1.env.MYSQL_DATABASE})`);
};
exports.connectMySQL = connectMySQL;
//# sourceMappingURL=mysql.js.map