"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mysql_1 = require("../configs/mysql");
const toUser = (row) => ({
    id: row.id,
    name: row.name,
    createdAt: row.created_at.toISOString(),
});
exports.UserModel = {
    async insert(id, name) {
        await mysql_1.pool.execute("INSERT INTO users (id, name) VALUES (?, ?)", [id, name]);
    },
    async findById(id) {
        const [rows] = await mysql_1.pool.execute("SELECT id, name, created_at FROM users WHERE id = ?", [id]);
        const row = rows[0];
        return row ? toUser(row) : null;
    },
    /** Returns which of the given ids exist. */
    async findExistingIds(ids) {
        if (ids.length === 0)
            return new Set();
        const placeholders = ids.map(() => "?").join(", ");
        const [rows] = await mysql_1.pool.execute(`SELECT id FROM users WHERE id IN (${placeholders})`, ids);
        return new Set(rows.map((row) => row.id));
    },
};
//# sourceMappingURL=user.model.js.map