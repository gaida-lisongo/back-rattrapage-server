import { Model } from './Model';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';

interface IUser {
    id: number;
    email: string;
    password: string;
}

export class UserModel extends Model {
    constructor() {
        super('users');
    }

    private hashPassword(password: string): string {
        return createHash('sha1').update(password).digest('hex');
    }

    async authenticate(email: string, password: string) {
        const hashedPassword = this.hashPassword(password);

        const user = await this.request<IUser[]>(
            'SELECT * FROM etudiant WHERE matricule = ? AND mdp = ?',
            [email, hashedPassword]
        );

        if (!user) {
            return this.response(null, false);
        }

        const token = jwt.sign(
            { id: user[0].id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );
        
        return this.response({ token, user: user[0] });
    }

    async register(email: string, password: string) {
        const hashedPassword = this.hashPassword(password);
        
        const result = await this.request<{insertId: number}>(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        return this.response({ 
            userId: result.insertId,
            email 
        });
    }
}