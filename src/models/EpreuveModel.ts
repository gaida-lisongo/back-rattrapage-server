import { Model } from './Model';

interface IExam {
    id: number;
    matiere: string;
    duree: number;
    date_creation: Date;
    annee: string;
}

interface IQuestion {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
}

export class EpreuveModel extends Model {
    constructor() {
        super('data_rattrapage');
    }

    async getExamById(id: number) {
        const exam = await this.request<IExam[]>(
            `SELECT rattrapage_matiere.*, matiere.designation as 'matiere', matiere.credit, CONCAT('Année académique ', annee.debut, ' - ', annee.fin) as 'annee'
            FROM rattrapage_matiere 
            INNER JOIN matiere ON matiere.id = rattrapage_matiere.id_matiere
            INNER JOIN annee ON annee.id = rattrapage_matiere.id_annee
            WHERE rattrapage_matiere.id = ?`,
            [id]
        );
        return this.response(exam);
    }

    async getExamQuestions(examId: number) {
        const questions = await this.request<IQuestion[]>(
            'SELECT questions_rattrapage.id, questions_rattrapage.enonce, questions_rattrapage.pts, questions_rattrapage.choix_1, questions_rattrapage.choix_2,  questions_rattrapage.choix_3,  questions_rattrapage.choix_4, questions_rattrapage.choix_5,  questions_rattrapage.choix_6, questions_rattrapage.choix_7, questions_rattrapage.image FROM questions_rattrapage WHERE id_rattrapage = ?',
            [examId]
        );
        return this.response(questions);
    }

    async checkAnswer(questionId: number, answer: string) {
        const result = await this.request<{ reponse: number }[]>(
            'SELECT reponse FROM questions_rattrapage WHERE id = ?',
            [questionId]
        );

        console.log('result', result);
        console.log('answer', answer);
        const correct = result[0].reponse;
        console.log('correct', correct == parseInt(answer));
        return this.response({
            correct: correct == parseInt(answer)
        });
    }
}