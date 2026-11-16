"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = __importDefault(require("log4js"));
const env_1 = require("./env");
log4js_1.default.configure({
    appenders: { console: { type: "console" } },
    categories: { default: { appenders: ["console"], level: env_1.env.LOG_LEVEL } },
});
exports.logger = log4js_1.default.getLogger("chat-server");
//# sourceMappingURL=logger.js.map