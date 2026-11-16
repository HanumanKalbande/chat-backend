"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Runs every .sql file in a folder, in filename order.
 * Usage: node dist/scripts/runSql.js db/migrations
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("../configs/env");
const run = async () => {
    const dir = process.argv[2];
    if (!dir)
        throw new Error("Usage: runSql <folder>");
    const files = fs_1.default
        .readdirSync(dir)
        .filter((file) => file.endsWith(".sql"))
        .sort();
    const connection = await promise_1.default.createConnection({
        host: env_1.env.MYSQL_HOST,
        port: env_1.env.MYSQL_PORT,
        user: env_1.env.MYSQL_USER,
        password: env_1.env.MYSQL_PASSWORD,
        database: env_1.env.MYSQL_DATABASE,
        multipleStatements: true,
    });
    try {
        for (const file of files) {
            await connection.query(fs_1.default.readFileSync(path_1.default.join(dir, file), "utf8"));
            console.log(`ran ${file}`);
        }
    }
    finally {
        await connection.end();
    }
};
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=runSql.js.map