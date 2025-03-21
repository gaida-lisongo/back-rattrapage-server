"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultModel = void 0;
const Model_1 = require("./Model");
class ResultModel extends Model_1.Model {
    constructor() {
        super('results');
    }
    async saveResult(studentId, examId, score, url) {
        const result = await this.request('INSERT INTO resultat_rattrapage (id_rattrapage, id_etudiant, score) VALUES (?, ?, ?)', [examId, studentId, score]);
        await this.clearCache(); // Clear cache after new result
        return this.response(result);
    }
    async getExamResults(examId) {
        const results = await this.request('SELECT * FROM resultat_rattrapage WHERE id_rattrapage = ?', [examId]);
        return this.response(results);
    }
    async getStudentResults(studentId) {
        const results = await this.request('SELECT * FROM resultat_rattrapage WHERE id_etudiant = ?', [studentId]);
        return this.response(results);
    }
}
exports.ResultModel = ResultModel;
//# sourceMappingURL=ResultModel.js.map