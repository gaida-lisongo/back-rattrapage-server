// src/types/index.ts

export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
}

export interface Exam {
    id: string;
    title: string;
    questions: Question[];
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
}

export interface Result {
    userId: string;
    examId: string;
    score: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ExamResponse {
    exam: Exam;
}

export interface ResultResponse {
    result: Result;
}