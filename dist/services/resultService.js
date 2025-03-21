"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = __importDefault(require("../models/result"));
class ResultService {
    async saveResult(userId, examId, score) {
        const result = new result_1.default({
            userId,
            examId,
            score,
        });
        return await result.save();
    }
    async getResultsByUserId(userId) {
        return await result_1.default.find({ userId });
    }
    async getResultsByExamId(examId) {
        return await result_1.default.find({ examId });
    }
}
exports.default = new ResultService();
//# sourceMappingURL=resultService.js.map