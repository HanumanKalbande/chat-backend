"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const firestore_1 = require("firebase-admin/firestore");
const admin = require('firebase-admin');
const firebase_1 = require("../configs/firebase");
const AppError_1 = require("../helpers/AppError");
const events_1 = require("../helpers/events");
const message_model_1 = require("../models/message.model");
const chat_service_1 = require("./chat.service");
/** The message must exist and belong to `userId`; only the sender may edit or delete it. */
const assertOwnMessage = (doc, messageId, userId) => {
    if (!doc)
        throw AppError_1.AppError.notFound(`Message not found: ${messageId}`);
    if (doc.senderId !== userId) {
        throw AppError_1.AppError.forbidden("Only the sender can edit or delete this message");
    }
    return doc;
};
const db = admin.database();
exports.messageService = {
    async send(chatId, senderId, text) {
        await chat_service_1.chatService.getForMember(chatId, senderId);
        var ref = (0, message_model_1.messagesCollection)(chatId).doc();
        // Server timestamp, not the client's or this Node process's clock:
        // one clock for every writer keeps the ordering consistent.
        // The sender has read their own message: "has X read it?" is always just
        // readBy[X], and unread counts never include your own messages.
        // Both server timestamps resolve to the same commit time.
        ref = db.ref(chatId).push();
        await ref.set({
            senderId,
            text,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
            readBy: { [senderId]: firestore_1.FieldValue.serverTimestamp() },
        });
        // Read back once to get the timestamp Firestore actually assigned.
       
        const message = { 'message id': ref.key};
        return message;
    },
    /**
     * Latest `limit` messages, returned oldest -> newest.
     * Pass `before` (a message id) to page further back in history.
     */
    async list(chatId, limit, before) {

       let db_acc =  admin.database();
        let a = db_acc.ref('c47a2c66-9bb4-4c0c-a0aa-901994f7eb82');
        
        return a;
        //let messages = {}
        // db.ref(chatId).once('value').then((snapshot) => {
        //  messages = { 'data' : json(snapshot.val())};
        // }).catch((error) => {
        //     //messages =  {'Error fetching messages' : error.message };
        // });
        // await chat_service_1.chatService.getById(chatId);
        // const collection = (0, message_model_1.messagesCollection)(chatId);
        // // Newest first so `limit` keeps the most recent messages; document id breaks
        // // ties between messages with the same timestamp so the order is stable.
        // let query = collection
        //     .orderBy("createdAt", "desc")
        //     .orderBy(firestore_1.FieldPath.documentId(), "desc")
        //     .limit(limit);
        // if (before) {
        //     const cursor = await collection.doc(before).get();
        //     if (!cursor.exists)
        //         throw AppError_1.AppError.notFound(`Message not found: ${before}`);
        //     query = query.startAfter(cursor);
        // }
        //const snapshot = await query.get();
        // const messages = snapshot.docs.map((doc) => (0, message_model_1.toMessage)(chatId, doc.id, doc.data())).reverse();
        // // A full page means there may be older messages; the oldest id is the next cursor.
        // const nextCursor = snapshot.size === limit ? (messages[0]?.id ?? null) : null;
        //return { chatId };
    },
    /**
     * Records that `userId` read the message. Idempotent: the first read time is
     * kept. The sender is already in readBy from send(), so for them it's a no-op.
     */
    async markRead(chatId, messageId, userId) {
        await chat_service_1.chatService.getForMember(chatId, userId);
        const ref = (0, message_model_1.messagesCollection)(chatId).doc(messageId);
        // Transaction so the "already read?" check and the write can't interleave
        // with another request for the same message.
        const { message, receipt } = await firebase_1.firestore.runTransaction(async (tx) => {
            const snapshot = await tx.get(ref);
            const doc = snapshot.data();
            if (!doc)
                throw AppError_1.AppError.notFound(`Message not found: ${messageId}`);
            if (doc.senderId === userId || doc.readBy[userId]) {
                return { message: (0, message_model_1.toMessage)(chatId, messageId, doc), receipt: null };
            }
            // Informational time (not used for ordering), so the local clock is fine
            // and saves reading the document back.
            const readAt = firestore_1.Timestamp.now();
            // FieldPath (not a "readBy.<id>" string) so the id is never parsed as a path.
            tx.update(ref, new firestore_1.FieldPath("readBy", userId), readAt);
            const updated = { ...doc, readBy: { ...doc.readBy, [userId]: readAt } };
            const newReceipt = {
                chatId,
                messageId,
                userId,
                readAt: readAt.toDate().toISOString(),
            };
            return { message: (0, message_model_1.toMessage)(chatId, messageId, updated), receipt: newReceipt };
        });
        if (receipt)
            events_1.domainEvents.emit("message:read", receipt);
        return message;
    },
    /** Replaces the text of a message. Only its sender can, and not once deleted. */
    async edit(chatId, messageId, userId, text) {
        await chat_service_1.chatService.getForMember(chatId, userId);
        const ref = (0, message_model_1.messagesCollection)(chatId).doc(messageId);
        // Transaction: an edit racing a delete must not write text back into a
        // message that was just deleted.
        const message = await firebase_1.firestore.runTransaction(async (tx) => {
            const doc = assertOwnMessage((await tx.get(ref)).data(), messageId, userId);
            if (doc.deletedAt)
                throw AppError_1.AppError.conflict("Message has been deleted and can't be edited");
            const editedAt = firestore_1.Timestamp.now();
            tx.update(ref, { text, editedAt });
            return (0, message_model_1.toMessage)(chatId, messageId, { ...doc, text, editedAt });
        });
        events_1.domainEvents.emit("message:edited", message);
        return message;
    },
    /**
     * Soft delete: clears the text and sets deletedAt, keeping the document so
     * clients can show "message deleted" and cursors/lastSeen stay valid.
     * Only the sender can delete. Deleting twice is a no-op.
     */
    async remove(chatId, messageId, userId) {
        await chat_service_1.chatService.getForMember(chatId, userId);
        const ref = (0, message_model_1.messagesCollection)(chatId).doc(messageId);
        const { message, changed } = await firebase_1.firestore.runTransaction(async (tx) => {
            const doc = assertOwnMessage((await tx.get(ref)).data(), messageId, userId);
            if (doc.deletedAt)
                return { message: (0, message_model_1.toMessage)(chatId, messageId, doc), changed: false };
            const deletedAt = firestore_1.Timestamp.now();
            tx.update(ref, { text: "", deletedAt });
            return { message: (0, message_model_1.toMessage)(chatId, messageId, { ...doc, text: "", deletedAt }), changed: true };
        });
        if (changed)
            events_1.domainEvents.emit("message:deleted", message);
        return message;
    },
    /**
     * Moves the user's "last seen message" pointer for this chat.
     * Only moves forward: a late request for an older message is ignored.
     */
    async updateLastSeen(chatId, userId, messageId) {
        await chat_service_1.chatService.getForMember(chatId, userId);
        const messageRef = (0, message_model_1.messagesCollection)(chatId).doc(messageId);
        const lastSeenRef = (0, message_model_1.lastSeenCollection)(chatId).doc(userId);
        const result = await firebase_1.firestore.runTransaction(async (tx) => {
            const [messageSnap, lastSeenSnap] = await Promise.all([tx.get(messageRef), tx.get(lastSeenRef)]);
            const message = messageSnap.data();
            if (!message)
                throw AppError_1.AppError.notFound(`Message not found: ${messageId}`);
            const current = lastSeenSnap.data();
            const isNewer = !current ||
                (0, message_model_1.compareMessagePosition)({ createdAt: message.createdAt, id: messageId }, { createdAt: current.messageCreatedAt, id: current.messageId }) > 0;
            if (current && !isNewer) {
                return { lastSeen: (0, message_model_1.toLastSeen)(chatId, userId, current), updated: false };
            }
            const doc = { messageId, messageCreatedAt: message.createdAt, updatedAt: firestore_1.Timestamp.now() };
            tx.set(lastSeenRef, doc);
            return { lastSeen: (0, message_model_1.toLastSeen)(chatId, userId, doc), updated: true };
        });
        if (result.updated)
            events_1.domainEvents.emit("lastseen:updated", result.lastSeen);
        return result;
    },
};
//# sourceMappingURL=message.service.js.map