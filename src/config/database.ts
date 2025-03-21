import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import mongoose, { set } from 'mongoose';
import memjs from 'memjs';
import { close } from 'fs';
dotenv.config();

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
  enableKeepAlive: true as true,
  keepAliveInitialDelay: 0
};

const mongoOptions = {
    maxPoolSize: 100,
    minPoolSize: 50,
    socketTimeoutMS: 30000,
    keepAlive: true,
    connectTimeoutMS: 30000,
    family: 4 as const,
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
        const pool = await mysql.createPool(mysqlConfig);
        
        return pool;

    } catch (error) {
        console.log('Error connecting to MySQL:', error);
        throw error;
    }
};

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', false);
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI, mongoOptions);

        mongoose.connection.on('connected', () => {
            console.log(`MongoDB connected to ${mongoose.connection.host}`);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const connectToMemcache = async () => {
    try {
        const client = await memjs.Client.create(memcacheConfig.server, {
            username: memcacheConfig.username,
            password: memcacheConfig.password,
            timeout: 1,
            keepAlive: true,
            failover: true,  // default: false
        });


        client.set('hello', 'memcachier', {expires:0}, function(err: Error | null, val: boolean) {
            if(err != null) {
              console.log('Error setting value: ' + err)
            }
          })
          
        client.get('hello', function(err: Error | null, val: Buffer | null) {
            if(err != null) {
                console.log('Error getting value: ' + err)
            }
            else if (val != null) {
                console.log(val.toString('utf8'))
            }
        })

        return {
            getting: async (key : string) => {
                return new Promise((resolve, reject) => {
                    client.get(key, function(err: Error | null, val: Buffer | null) {
                        if(err != null) {
                            reject(err);
                        } else {
                            resolve(val?.toString('utf8'));
                        }
                    });
                });
            },
            setting: async (key: string, value: any) => {
                return new Promise((resolve, reject) => {
                    client.set(key, value, { expires: 0 }, function(err: Error | null, val: boolean) {
                        if(err != null) {
                            reject(err);
                        } else {
                            resolve(val);
                        }
                    });
                });
            }
        };
    } catch (error) {
        console.error('Error connecting to Memcachier:', error);
        throw error;
    }
};

export default {
    mysqlCursor : connectToMySQL(),
    mongoDb: connectToMongo(),
    memcache: connectToMemcache()
};