"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const crypto_1 = require("crypto");
const AppError_1 = require("../helpers/AppError");
const events_1 = require("../helpers/events");
const chat_model_1 = require("../models/chat.model");
const user_service_1 = require("./user.service");
exports.chatService = {
    /** Returns the existing 1:1 chat between the two users, or creates it. */
    async createOrGet(userAId, userBId) {
        if (userAId === userBId) {
            throw AppError_1.AppError.badRequest("A chat needs two different users");
        }
        await user_service_1.userService.assertExists(userAId, userBId);
        // Canonical order: (A, B) and (B, A) are the same chat.
        const [lowId, highId] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
        const newId = (0, crypto_1.randomUUID)();
        await chat_model_1.ChatModel.insertIfAbsent(newId, lowId, highId);
        const chat = await chat_model_1.ChatModel.findByPair(lowId, highId);
        if (!chat)
            throw new Error(`Chat for ${lowId}/${highId} missing after upsert`);
        // If the stored row carries the id we just generated, this call created it.
        // (affectedRows is unreliable here: mysql2 enables FOUND_ROWS by default,
        // so a no-op duplicate also reports 1.)
        const created = chat.id === newId;
        if (created)
            events_1.domainEvents.emit("chat:created", chat);
        return { chat, created };
    },
    async listForUser(userId) {
        await user_service_1.userService.assertExists(userId);
        return chat_model_1.ChatModel.findByUserId(userId);
    },
    async getById(chatId) {
        const chat = await chat_model_1.ChatModel.findById(chatId);
        if (!chat)
            throw AppError_1.AppError.notFound(`Chat not found: ${chatId}`);
        return chat;
    },
    /** Loads the chat and checks the user is one of its two members. */
    async getForMember(chatId, userId) {
        const chat = await exports.chatService.getById(chatId);
        if (!chat.memberIds.includes(userId)) {
            throw AppError_1.AppError.forbidden("User is not a member of this chat");
        }
        return chat;
    },
};
//# sourceMappingURL=chat.service.js.map