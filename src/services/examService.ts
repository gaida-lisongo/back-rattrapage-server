import { Exam } from '../models/exam';
import { Result } from '../models/result';
import { User } from '../models/user';
import { Database } from '../config/database';

export class ExamService {
    private db: Database;

    constructor() {
        this.db = new Database();
    }

    async getExamById(examId: number): Promise<Exam | null> {
        const connection = await this.db.getMySQLConnection();
        const [rows] = await connection.execute('SELECT * FROM exams WHERE id = ?', [examId]);
        return rows.length > 0 ? rows[0] : null;
    }

    async checkUserResponses(examId: number, userId: number, responses: any): Promise<Result> {
        const exam = await this.getExamById(examId);
        if (!exam) {
            throw new Error('Exam not found');
        }

        // Logic to check responses and calculate score
        const score = this.calculateScore(exam.questions, responses);

        const result = new Result({
            userId,
            examId,
            score,
        });

        await result.save(); // Assuming save method is defined in the Result model
        return result;
    }

    private calculateScore(questions: any[], responses: any): number {
        let score = 0;
        questions.forEach((question, index) => {
            if (question.correctAnswer === responses[index]) {
                score++;
            }
        });
        return score;
    }
}