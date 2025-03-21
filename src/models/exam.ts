import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Exam extends Model {
    public id!: number;
    public title!: string;
    public questions!: string; // JSON string or similar format for questions

    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Exam.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    questions: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'exams',
});