"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequest = exports.socketSchemas = exports.userChatsSchema = exports.lastSeenSchema = exports.deleteMessageSchema = exports.editMessageSchema = exports.markReadSchema = exports.getMessagesSchema = exports.sendMessageSchema = exports.createChatSchema = exports.createUserSchema = exports.MAX_PAGE_SIZE = void 0;
const zod_1 = require("zod");
// Lowercased so the same id always compares/sorts the same way (chat pairs are sorted).
const uuid = zod_1.z
    .string()
    .uuid({ message: "must be a valid UUID" })
    .transform((value) => value.toLowerCase());
const userId = uuid;
const chatId = uuid;
// Firestore auto-ids are 20 alphanumeric chars; a "/" would break the document path.
const messageId = zod_1.z.string().regex(/^[A-Za-z0-9_-]{1,128}$/, { message: "invalid message id" });
const text = zod_1.z.string().trim().min(1, "cannot be empty").max(2000, "max 2000 characters");
exports.MAX_PAGE_SIZE = 100;
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({ name: zod_1.z.string().trim().min(1).max(100) }),
});
exports.createChatSchema = zod_1.z.object({
    body: zod_1.z.object({ userAId: userId, userBId: userId }),
});
exports.sendMessageSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId }),
    body: zod_1.z.object({ senderId: userId, text }),
});
exports.getMessagesSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId }),
    query: zod_1.z.object({
        limit: zod_1.z.coerce.number().int().min(1).max(exports.MAX_PAGE_SIZE).default(50),
        before: messageId.optional(),
    }),
});
exports.markReadSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId, messageId }),
    body: zod_1.z.object({ userId }),
});
exports.editMessageSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId, messageId }),
    body: zod_1.z.object({ userId, text }),
});
exports.deleteMessageSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId, messageId }),
    body: zod_1.z.object({ userId }),
});
exports.lastSeenSchema = zod_1.z.object({
    params: zod_1.z.object({ chatId }),
    body: zod_1.z.object({ userId, messageId }),
});
exports.userChatsSchema = zod_1.z.object({
    params: zod_1.z.object({ userId }),
});
// Socket payloads. The acting user comes from the socket handshake, not the payload.
exports.socketSchemas = {
    joinChat: zod_1.z.object({ chatId }),
    sendMessage: zod_1.z.object({ chatId, text }),
    markRead: zod_1.z.object({ chatId, messageId }),
    editMessage: zod_1.z.object({ chatId, messageId, text }),
    deleteMessage: zod_1.z.object({ chatId, messageId }),
    lastSeen: zod_1.z.object({ chatId, messageId }),
};
/**
 * Parses params/query/body against a schema and returns fully typed values.
 * A ZodError is turned into a 400 by the error handler.
 */
const parseRequest = (schema, req) => schema.parse({ params: req.params, query: req.query, body: req.body ?? {} });
exports.parseRequest = parseRequest;
//# sourceMappingURL=schemas.js.map