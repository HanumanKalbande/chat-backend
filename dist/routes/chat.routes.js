"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const asyncHandler_1 = require("../helpers/asyncHandler");
const router = (0, express_1.Router)();
router.post("/create", (0, asyncHandler_1.asyncHandler)(chat_controller_1.createChat));
router.post("/:chatId/message/send", (0, asyncHandler_1.asyncHandler)(chat_controller_1.sendMessage));
router.get("/:chatId/messages", (0, asyncHandler_1.asyncHandler)(chat_controller_1.getMessages));
router.post("/:chatId/message/:messageId/read", (0, asyncHandler_1.asyncHandler)(chat_controller_1.markMessageRead));
router.post("/:chatId/message/:messageId/edit", (0, asyncHandler_1.asyncHandler)(chat_controller_1.editMessage));
router.post("/:chatId/message/:messageId/delete", (0, asyncHandler_1.asyncHandler)(chat_controller_1.deleteMessage));
router.post("/:chatId/lastseen", (0, asyncHandler_1.asyncHandler)(chat_controller_1.updateLastSeen));
exports.default = router;
//# sourceMappingURL=chat.routes.js.map