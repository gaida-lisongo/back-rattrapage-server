import memjs from 'memjs';
import mysql from 'mysql2/promise';
import config from '../config';

export class Model {
    protected db!: mysql.Pool;
    protected tableName: string;
    protected cache: any;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.initDb();
    }

    private async initDb(): Promise<void> {
        this.db = await config.mysqlCursor;
        this.cache = await config.memcache;
    }
    
    protected async request<T>(query: string, params: any[] = []): Promise<T> {
        const cacheKey = this.generateCacheKey(query, params);
        // Check cache first
        try {
            const cached = await this.cache.getting(cacheKey);
            if (cached && cached.value) {
                try {
                    return JSON.parse(cached.value.toString()) as T;
                } catch (parseError) {
                    console.error('Cache parse error:', parseError);
                    // Continue to database query if parse fails
                }
            }
        } catch (error) {
            console.error('Cache error:', error);
            // Continue to database query if cache fails
        }

        // If not in cache or cache failed, query database
        const [rows] = await this.db.execute(query, params);
        
        try {
            // Store in cache for future requests
            await this.cache.setting(cacheKey, JSON.stringify(rows), { expires: 300 }); // 5 minutes cache
        } catch (cacheError) {
            console.error('Cache setting error:', cacheError);
            // Continue even if cache setting fails
        }
        
        return rows as T;
    }

    protected async response<T>(data: T, status: boolean = true): Promise<{
        status: boolean;
        data: T;
        timestamp: number;
    }> {
        return {
            status,
            data,
            timestamp: Date.now()
        };
    }

    protected async lastInsertId(): Promise<number> {
        const [result] = await this.db.execute('SELECT LAST_INSERT_ID() as id');
        return (result as any)[0].id;
    }

    private generateCacheKey(query: string, params: any[]): string {
        return `${this.tableName}:${query}:${JSON.stringify(params)}`;
    }

    protected async clearCache(): Promise<void> {
        // Implement cache clearing logic
    }
}