"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const crypto_1 = require("crypto");
const AppError_1 = require("../helpers/AppError");
const user_model_1 = require("../models/user.model");
exports.userService = {
    async create(name) {
        const id = (0, crypto_1.randomUUID)();
        await user_model_1.UserModel.insert(id, name);
        const user = await user_model_1.UserModel.findById(id);
        if (!user)
            throw new Error(`User ${id} missing right after insert`);
        return user;
    },
    async assertExists(...ids) {
        const existing = await user_model_1.UserModel.findExistingIds(ids);
        const missing = ids.filter((id) => !existing.has(id));
        if (missing.length > 0) {
            throw AppError_1.AppError.notFound(`User not found: ${missing.join(", ")}`);
        }
    },
};
//# sourceMappingURL=user.service.js.map