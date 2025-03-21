"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamService = void 0;
const result_1 = require("../models/result");
const database_1 = require("../config/database");
class ExamService {
    constructor() {
        this.db = new database_1.Database();
    }
    async getExamById(examId) {
        const connection = await this.db.getMySQLConnection();
        const [rows] = await connection.execute('SELECT * FROM exams WHERE id = ?', [examId]);
        return rows.length > 0 ? rows[0] : null;
    }
    async checkUserResponses(examId, userId, responses) {
        const exam = await this.getExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }
        // Logic to check responses and calculate score
        const score = this.calculateScore(exam.questions, responses);
        const result = new result_1.Result({
            userId,
            examId,
            score,
        });
        await result.save(); // Assuming save method is defined in the Result model
        return result;
    }
    calculateScore(questions, responses) {
        let score = 0;
        questions.forEach((question, index) => {
            if (question.correctAnswer === responses[index]) {
                score++;
            }
        });
        return score;
    }
}
exports.ExamService = ExamService;
//# sourceMappingURL=examService.js.map