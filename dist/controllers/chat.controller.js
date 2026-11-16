"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastSeen = exports.deleteMessage = exports.editMessage = exports.markMessageRead = exports.getMessages = exports.sendMessage = exports.createChat = void 0;
const http_status_1 = require("http-status");
const schemas_1 = require("../helpers/schemas");
const chat_service_1 = require("../services/chat.service");
const message_service_1 = require("../services/message.service");
// POST /chat/create
const createChat = async (req, res) => {
    const { body } = (0, schemas_1.parseRequest)(schemas_1.createChatSchema, req);
    const { chat, created } = await chat_service_1.chatService.createOrGet(body.userAId, body.userBId);
    res.status(created ? http_status_1.status.CREATED : http_status_1.status.OK).json({ chatId: chat.id, created, chat });
};
exports.createChat = createChat;
// POST /chat/:chatId/message/send
const sendMessage = async (req, res) => {
    const { params, body } = (0, schemas_1.parseRequest)(schemas_1.sendMessageSchema, req);
    const message = await message_service_1.messageService.send(params.chatId, body.senderId, body.text);
    res.status(http_status_1.status.CREATED).json({ message });
};
exports.sendMessage = sendMessage;
// GET /chat/:chatId/messages?limit=50&before=<messageId>
const getMessages = async (req, res) => {
    const { params, query } = (0, schemas_1.parseRequest)(schemas_1.getMessagesSchema, req);
    const result = await message_service_1.messageService.list(params.chatId, query.limit, query.before);
    res.status(http_status_1.status.OK).json(result);
};
exports.getMessages = getMessages;
// POST /chat/:chatId/message/:messageId/read
const markMessageRead = async (req, res) => {
    const { params, body } = (0, schemas_1.parseRequest)(schemas_1.markReadSchema, req);
    const message = await message_service_1.messageService.markRead(params.chatId, params.messageId, body.userId);
    res.status(http_status_1.status.OK).json({ message });
};
exports.markMessageRead = markMessageRead;
// POST /chat/:chatId/message/:messageId/edit
const editMessage = async (req, res) => {
    const { params, body } = (0, schemas_1.parseRequest)(schemas_1.editMessageSchema, req);
    const message = await message_service_1.messageService.edit(params.chatId, params.messageId, body.userId, body.text);
    res.status(http_status_1.status.OK).json({ message });
};
exports.editMessage = editMessage;
// POST /chat/:chatId/message/:messageId/delete
const deleteMessage = async (req, res) => {
    const { params, body } = (0, schemas_1.parseRequest)(schemas_1.deleteMessageSchema, req);
    const message = await message_service_1.messageService.remove(params.chatId, params.messageId, body.userId);
    res.status(http_status_1.status.OK).json({ message });
};
exports.deleteMessage = deleteMessage;
// POST /chat/:chatId/lastseen
const updateLastSeen = async (req, res) => {
    const { params, body } = (0, schemas_1.parseRequest)(schemas_1.lastSeenSchema, req);
    const result = await message_service_1.messageService.updateLastSeen(params.chatId, body.userId, body.messageId);
    res.status(http_status_1.status.OK).json(result);
};
exports.updateLastSeen = updateLastSeen;
//# sourceMappingURL=chat.controller.js.map