"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserChats = exports.createUser = void 0;
const http_status_1 = require("http-status");
const schemas_1 = require("../helpers/schemas");
const chat_service_1 = require("../services/chat.service");
const user_service_1 = require("../services/user.service");
// POST /user/create  (helper for testing; not part of the assignment)
const createUser = async (req, res) => {
    const { body } = (0, schemas_1.parseRequest)(schemas_1.createUserSchema, req);
    const user = await user_service_1.userService.create(body.name);
    res.status(http_status_1.status.CREATED).json({ user });
};
exports.createUser = createUser;
// GET /user/:userId/chats
const getUserChats = async (req, res) => {
    const { params } = (0, schemas_1.parseRequest)(schemas_1.userChatsSchema, req);
    const chats = await chat_service_1.chatService.listForUser(params.userId);
    res.status(http_status_1.status.OK).json({ chats });
};
exports.getUserChats = getUserChats;
//# sourceMappingURL=user.controller.js.map