"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const env_1 = require("./env");
const logger_1 = require("./logger");
const initFirebase = () => {
    const projectId = env_1.env.FIREBASE_PROJECT_ID;
    if (!projectId)
        throw new Error("FIREBASE_PROJECT_ID is not set");
    if (env_1.env.FIRESTORE_EMULATOR_HOST) {
        // firebase-admin reads FIRESTORE_EMULATOR_HOST itself; only a project id is needed.
        logger_1.logger.info(`Firestore: using emulator at ${env_1.env.FIRESTORE_EMULATOR_HOST}`);
        return (0, app_1.initializeApp)({ projectId });
    }
    if (!env_1.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        throw new Error("Set FIREBASE_SERVICE_ACCOUNT_PATH (real Firebase) or FIRESTORE_EMULATOR_HOST (emulator)");
    }
    const keyPath = path_1.default.resolve(env_1.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const serviceAccount = JSON.parse(fs_1.default.readFileSync(keyPath, "utf8"));
    logger_1.logger.info(`Firestore: using project "${projectId}"`);
    return (0, app_1.initializeApp)({ credential: (0, app_1.cert)(serviceAccount), databaseURL: 'https://chat-app-533a7-default-rtdb.firebaseio.com/'});
};
exports.firestore = (0, firestore_1.getFirestore)(initFirebase());
//# sourceMappingURL=firebase.js.map