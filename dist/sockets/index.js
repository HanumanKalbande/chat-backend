"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const zod_1 = require("zod");
const logger_1 = require("../configs/logger");
const events_1 = require("../helpers/events");
const user_model_1 = require("../models/user.model");
const chat_socket_1 = require("./chat.socket");
const handshakeSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .uuid()
        .transform((value) => value.toLowerCase()),
});
const initSockets = (httpServer, corsOrigin) => {
    const io = new socket_io_1.Server(httpServer, { cors: { origin: corsOrigin } });
    // Handshake: client connects with io(url, { auth: { userId } }).
    io.use(async (socket, next) => {
        try {
            const parsed = handshakeSchema.safeParse(socket.handshake.auth);
            if (!parsed.success) {
                logger_1.logger.warn(`socket rejected: invalid userId, socket=${socket.id} ip=${socket.handshake.address}`);
                return next(new Error("auth.userId must be a valid UUID"));
            }
            const user = await user_model_1.UserModel.findById(parsed.data.userId);
            if (!user) {
                logger_1.logger.warn(`socket rejected: unknown user=${parsed.data.userId} socket=${socket.id}`);
                return next(new Error("Unknown user"));
            }
            socket.data.userId = user.id;
            return next();
        }
        catch (err) {
            logger_1.logger.error("socket handshake failed:", err);
            return next(new Error("Internal server error"));
        }
    });
    io.on("connection", (socket) => {
        const { userId } = socket.data;
        // Personal room: lets us notify the user about new chats on every device.
        void socket.join((0, chat_socket_1.userRoom)(userId));
        logger_1.logger.info(`socket connected: user=${userId} socket=${socket.id}`);
        (0, chat_socket_1.registerChatHandlers)(socket);
        socket.on("disconnect", (reason) => {
            logger_1.logger.info(`socket disconnected: user=${userId} socket=${socket.id} reason=${reason}`);
        });
    });
    // Broadcast domain events, whether they came from REST or from a socket.
    events_1.domainEvents.on("chat:created", (chat) => {
        io.to(chat.memberIds.map(chat_socket_1.userRoom)).emit("chat:created", chat);
    });
    events_1.domainEvents.on("message:new", (message) => {
        io.to((0, chat_socket_1.chatRoom)(message.chatId)).emit("message:new", message);
    });
    events_1.domainEvents.on("message:edited", (message) => {
        io.to((0, chat_socket_1.chatRoom)(message.chatId)).emit("message:edited", message);
    });
    events_1.domainEvents.on("message:deleted", (message) => {
        io.to((0, chat_socket_1.chatRoom)(message.chatId)).emit("message:deleted", message);
    });
    events_1.domainEvents.on("message:read", (receipt) => {
        io.to((0, chat_socket_1.chatRoom)(receipt.chatId)).emit("message:read", receipt);
    });
    events_1.domainEvents.on("lastseen:updated", (lastSeen) => {
        io.to((0, chat_socket_1.chatRoom)(lastSeen.chatId)).emit("lastseen:updated", lastSeen);
    });
    return io;
};
exports.initSockets = initSockets;
//# sourceMappingURL=index.js.map