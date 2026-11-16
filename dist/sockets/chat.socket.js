"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = exports.userRoom = exports.chatRoom = void 0;
const logger_1 = require("../configs/logger");
const AppError_1 = require("../helpers/AppError");
const schemas_1 = require("../helpers/schemas");
const chat_service_1 = require("../services/chat.service");
const message_service_1 = require("../services/message.service");
const chatRoom = (chatId) => `chat:${chatId}`;
exports.chatRoom = chatRoom;
const userRoom = (userId) => `user:${userId}`;
exports.userRoom = userRoom;
/**
 * Wraps a handler: validates the payload, runs it, and answers through the
 * ack callback with { ok, data } or { ok: false, error }.
 */
const handle = (event, schema, run) => async (payload, ack) => {
    try {
        const data = await run(schema.parse(payload));
        if (typeof ack === "function")
            ack({ ok: true, data });
    }
    catch (err) {
        const { message, details, expected } = (0, AppError_1.toErrorResponse)(err);
        if (!expected)
            logger_1.logger.error(`socket event "${event}" failed:`, err);
        if (typeof ack === "function")
            ack({ ok: false, error: { message, ...(details && { details }) } });
    }
};
const registerChatHandlers = (socket) => {
    // The acting user always comes from the handshake, never from the payload.
    const { userId } = socket.data;
    socket.on("chat:join", handle("chat:join", schemas_1.socketSchemas.joinChat, async ({ chatId }) => {
        await chat_service_1.chatService.getForMember(chatId, userId);
        await socket.join((0, exports.chatRoom)(chatId));
        return { chatId };
    }));
    socket.on("chat:leave", handle("chat:leave", schemas_1.socketSchemas.joinChat, async ({ chatId }) => {
        await socket.leave((0, exports.chatRoom)(chatId));
        return { chatId };
    }));
    // The handlers below call the same services as the REST API; the resulting
    // broadcasts come from the domain events in sockets/index.ts.
    socket.on("message:send", handle("message:send", schemas_1.socketSchemas.sendMessage, ({ chatId, text }) => message_service_1.messageService.send(chatId, userId, text)));
    socket.on("message:read", handle("message:read", schemas_1.socketSchemas.markRead, ({ chatId, messageId }) => message_service_1.messageService.markRead(chatId, messageId, userId)));
    socket.on("message:edit", handle("message:edit", schemas_1.socketSchemas.editMessage, ({ chatId, messageId, text }) => message_service_1.messageService.edit(chatId, messageId, userId, text)));
    socket.on("message:delete", handle("message:delete", schemas_1.socketSchemas.deleteMessage, ({ chatId, messageId }) => message_service_1.messageService.remove(chatId, messageId, userId)));
    socket.on("lastseen:update", handle("lastseen:update", schemas_1.socketSchemas.lastSeen, ({ chatId, messageId }) => message_service_1.messageService.updateLastSeen(chatId, userId, messageId)));
};
exports.registerChatHandlers = registerChatHandlers;
//# sourceMappingURL=chat.socket.js.map