"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const config_1 = __importDefault(require("../config"));
class Model {
    constructor(tableName) {
        this.tableName = tableName;
        this.initDb();
    }
    async initDb() {
        this.db = await config_1.default.mysqlCursor;
        this.cache = await config_1.default.memcache;
    }
    async request(query, params = []) {
        const cacheKey = this.generateCacheKey(query, params);
        // Check cache first
        try {
            const cached = await this.cache.getting(cacheKey);
            if (cached.value) {
                return JSON.parse(cached.value.toString());
            }
        }
        catch (error) {
            console.error('Cache error:', error);
        }
        // If not in cache, query database
        const [rows] = await this.db.execute(query, params);
        // Store in cache for future requests
        await this.cache.setting(cacheKey, JSON.stringify(rows), { expires: 300 }); // 5 minutes cache
        return rows;
    }
    async response(data, status = true) {
        return {
            status,
            data,
            timestamp: Date.now()
        };
    }
    async lastInsertId() {
        const [result] = await this.db.execute('SELECT LAST_INSERT_ID() as id');
        return result[0].id;
    }
    generateCacheKey(query, params) {
        return `${this.tableName}:${query}:${JSON.stringify(params)}`;
    }
    async clearCache() {
        // Implement cache clearing logic
    }
}
exports.Model = Model;
//# sourceMappingURL=Model.js.map