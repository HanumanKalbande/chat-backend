"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config({ quiet: true });
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "production", "test"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(8080),
    CORS_ORIGIN: zod_1.z.string().default("*"),
    LOG_LEVEL: zod_1.z.enum(["trace", "debug", "info", "warn", "error"]).default("info"),
    MYSQL_HOST: zod_1.z.string().default("localhost"),
    MYSQL_PORT: zod_1.z.coerce.number().int().positive().default(3306),
    MYSQL_USER: zod_1.z.string().min(1),
    MYSQL_PASSWORD: zod_1.z.string(),
    MYSQL_DATABASE: zod_1.z.string().min(1),
    // Optional here so DB scripts can run without Firebase; configs/firebase.ts checks them.
    FIREBASE_PROJECT_ID: zod_1.z.string().optional(),
    // Path to the service account JSON. Not needed when using the emulator.
    FIREBASE_SERVICE_ACCOUNT_PATH: zod_1.z.string().optional(),
    // e.g. "localhost:8081". When set, firebase-admin talks to the emulator.
    FIRESTORE_EMULATOR_HOST: zod_1.z.string().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    // Fail fast on startup instead of crashing later on the first request.
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map