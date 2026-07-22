import dotenv from 'dotenv';

dotenv.config();


export const environment = {

  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // PostgreSQL
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'parking_user',
    password: process.env.POSTGRES_PASSWORD || 'parking_pass_123',
    database: process.env.POSTGRES_DB || 'parking_db',
  },

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/parking_logs',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};
