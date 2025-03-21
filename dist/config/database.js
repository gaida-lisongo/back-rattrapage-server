"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
const mongoose_1 = __importDefault(require("mongoose"));
const memjs_1 = __importDefault(require("memjs"));
dotenv_1.default.config();
const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};
const mongoOptions = {
    maxPoolSize: 100,
    minPoolSize: 50,
    socketTimeoutMS: 30000,
    keepAlive: true,
    connectTimeoutMS: 30000,
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
        w: 'majority',
        j: true
    },
    ssl: true,
    retryWrites: true,
    directConnection: false,
    authSource: 'admin',
};
const memcacheConfig = {
    server: process.env.MEMCACHE_HOST || '',
    username: process.env.MEMCACHE_USER || '',
    password: process.env.MEMCACHE_PASSWORD || ''
};
const mongoURI = process.env.MONGODB_URI;
const connectToMySQL = async () => {
    try {
        const pool = await promise_1.default.createPool(mysqlConfig);
        return pool;
    }
    catch (error) {
        console.log('Error connecting to MySQL:', error);
        throw error;
    }
};
const connectToMongo = async () => {
    try {
        mongoose_1.default.set('strictQuery', false);
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose_1.default.connect(process.env.MONGODB_URI, mongoOptions);
        mongoose_1.default.connection.on('connected', () => {
            console.log(`MongoDB connected to ${mongoose_1.default.connection.host}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        return mongoose_1.default.connection;
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
const connectToMemcache = async () => {
    try {
        const client = await memjs_1.default.Client.create(memcacheConfig.server, {
            username: memcacheConfig.username,
            password: memcacheConfig.password,
            timeout: 1,
            keepAlive: true,
            failover: true, // default: false
        });
        client.set('hello', 'memcachier', { expires: 0 }, function (err, val) {
            if (err != null) {
                console.log('Error setting value: ' + err);
            }
        });
        client.get('hello', function (err, val) {
            if (err != null) {
                console.log('Error getting value: ' + err);
            }
            else if (val != null) {
                console.log(val.toString('utf8'));
            }
        });
        return {
            getting: async (key) => {
                return new Promise((resolve, reject) => {
                    client.get(key, function (err, val) {
                        if (err != null) {
                            reject(err);
                        }
                        else {
                            resolve(val?.toString('utf8'));
                        }
                    });
                });
            },
            setting: async (key, value) => {
                return new Promise((resolve, reject) => {
                    client.set(key, value, { expires: 0 }, function (err, val) {
                        if (err != null) {
                            reject(err);
                        }
                        else {
                            resolve(val);
                        }
                    });
                });
            }
        };
    }
    catch (error) {
        console.error('Error connecting to Memcachier:', error);
        throw error;
    }
};
exports.default = {
    mysqlCursor: connectToMySQL(),
    mongoDb: connectToMongo(),
    memcache: connectToMemcache()
};
//# sourceMappingURL=database.js.map