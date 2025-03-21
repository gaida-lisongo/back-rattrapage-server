import Result from '../models/result';
import { Document } from 'mongoose';

class ResultService {
    async saveResult(userId: string, examId: string, score: number): Promise<Document> {
        const result = new Result({
            userId,
            examId,
            score,
        });
        return await result.save();
    }

    async getResultsByUserId(userId: string): Promise<Document[]> {
        return await Result.find({ userId });
    }

    async getResultsByExamId(examId: string): Promise<Document[]> {
        return await Result.find({ examId });
    }
}

export default new ResultService();