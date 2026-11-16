"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const asyncHandler_1 = require("../helpers/asyncHandler");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncHandler_1.asyncHandler)(user_controller_1.createUser));
router.get("/:userId/chats", (0, asyncHandler_1.asyncHandler)(user_controller_1.getUserChats));
exports.default = router;
//# sourceMappingURL=user.routes.js.map