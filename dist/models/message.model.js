"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareMessagePosition = exports.toLastSeen = exports.toMessage = exports.lastSeenCollection = exports.messagesCollection = void 0;
const firebase_1 = require("../configs/firebase");
const converter = () => ({
    toFirestore: (data) => data,
    fromFirestore: (snapshot) => snapshot.data(),
});
const chatDoc = (chatId) => firebase_1.firestore.collection("chats").doc(chatId);
const messagesCollection = (chatId) => chatDoc(chatId).collection("messages").withConverter(converter());
exports.messagesCollection = messagesCollection;
const lastSeenCollection = (chatId) => chatDoc(chatId).collection("lastSeen").withConverter(converter());
exports.lastSeenCollection = lastSeenCollection;
const toMessage = (chatId, id, doc) => ({
    id,
    chatId,
    senderId: doc.senderId,
    text: doc.text,
    createdAt: doc.createdAt.toDate().toISOString(),
    readBy: Object.fromEntries(Object.entries(doc.readBy).map(([userId, at]) => [userId, at.toDate().toISOString()])),
    editedAt: doc.editedAt ? doc.editedAt.toDate().toISOString() : null,
    deletedAt: doc.deletedAt ? doc.deletedAt.toDate().toISOString() : null,
});
exports.toMessage = toMessage;
const toLastSeen = (chatId, userId, doc) => ({
    chatId,
    userId,
    messageId: doc.messageId,
    updatedAt: doc.updatedAt.toDate().toISOString(),
});
exports.toLastSeen = toLastSeen;
/**
 * Same order as the message list: createdAt, then document id as tie-breaker.
 * Returns a negative number if a comes before b.
 */
const compareMessagePosition = (a, b) => {
    if (!a.createdAt.isEqual(b.createdAt)) {
        return a.createdAt.seconds !== b.createdAt.seconds
            ? a.createdAt.seconds - b.createdAt.seconds
            : a.createdAt.nanoseconds - b.createdAt.nanoseconds;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
};
exports.compareMessagePosition = compareMessagePosition;
//# sourceMappingURL=message.model.js.map