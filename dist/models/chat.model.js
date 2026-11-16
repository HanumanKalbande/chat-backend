"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mysql_1 = require("../configs/mysql");
const COLUMNS = "id, user_low_id, user_high_id, created_at";
const toChat = (row) => ({
    id: row.id,
    memberIds: [row.user_low_id, row.user_high_id],
    createdAt: row.created_at.toISOString(),
});
exports.ChatModel = {
    /**
     * Inserts the chat unless one already exists for this pair (then does nothing).
     *
     * ON DUPLICATE KEY UPDATE (not INSERT IGNORE): only a duplicate pair is
     * treated as "already exists"; foreign key or CHECK violations still throw.
     */
    async insertIfAbsent(id, userLowId, userHighId) {
        await mysql_1.pool.execute(`INSERT INTO chats (id, user_low_id, user_high_id) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE id = id`, [id, userLowId, userHighId]);
    },
    async findByPair(userLowId, userHighId) {
        const [rows] = await mysql_1.pool.execute(`SELECT ${COLUMNS} FROM chats WHERE user_low_id = ? AND user_high_id = ?`, [userLowId, userHighId]);
        const row = rows[0];
        return row ? toChat(row) : null;
    },
    async findById(id) {
        const [rows] = await mysql_1.pool.execute(`SELECT ${COLUMNS} FROM chats WHERE id = ?`, [id]);
        const row = rows[0];
        return row ? toChat(row) : null;
    },
    /**
     * Newest chats first. UNION ALL lets each half use its own index
     * (uq_chats_pair for user_low_id, idx_chats_user_high for user_high_id);
     * a user can't be on both sides of the same chat, so there are no duplicates.
     */
    async findByUserId(userId) {
        const [rows] = await mysql_1.pool.execute(`SELECT ${COLUMNS} FROM chats WHERE user_low_id = ?
       UNION ALL
       SELECT ${COLUMNS} FROM chats WHERE user_high_id = ?
       ORDER BY created_at DESC`, [userId, userId]);
        return rows.map(toChat);
    },
};
//# sourceMappingURL=chat.model.js.map