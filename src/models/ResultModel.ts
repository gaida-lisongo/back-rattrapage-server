import { url } from 'inspector';
import { Model } from './Model';

interface IResult {
    id: number;
    exam_id: number;
    student_id: number;
    score: number;
    completed_at: Date;
}

export class ResultModel extends Model {
    constructor() {
        super('results');
    }

    async saveResult(studentId: number, examId: number, score: number, url: string) {
        const result = await this.request<IResult>(
            'INSERT INTO resultat_rattrapage (id_rattrapage, id_etudiant, score) VALUES (?, ?, ?)',
            [examId, studentId, score]
        );
        await this.clearCache(); // Clear cache after new result
        return this.response(result);
    }

    async getExamResults(examId: number) {
        const results = await this.request<IResult[]>(
            'SELECT * FROM resultat_rattrapage WHERE id_rattrapage = ?',
            [examId]
        );
        return this.response(results);
    }

    async getStudentResults(studentId: number) {
        const results = await this.request<IResult[]>(
            'SELECT * FROM resultat_rattrapage WHERE id_etudiant = ?',
            [studentId]
        );
        return this.response(results);
    }
}