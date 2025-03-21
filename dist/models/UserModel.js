"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const Model_1 = require("./Model");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserModel extends Model_1.Model {
    constructor() {
        super('users');
    }
    hashPassword(password) {
        return (0, crypto_1.createHash)('sha1').update(password).digest('hex');
    }
    async authenticate(email, password) {
        const hashedPassword = this.hashPassword(password);
        const user = await this.request('SELECT * FROM etudiant WHERE matricule = ? AND mdp = ?', [email, hashedPassword]);
        if (!user) {
            return this.response(null, false);
        }
        const token = jsonwebtoken_1.default.sign({ id: user[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
        return this.response({ token, user: user[0] });
    }
    async register(email, password) {
        const hashedPassword = this.hashPassword(password);
        const result = await this.request('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
        return this.response({
            userId: result.insertId,
            email
        });
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map