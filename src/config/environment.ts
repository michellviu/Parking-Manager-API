import dotenv from 'dotenv';

dotenv.config();

const buildMongoUri = () => {
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'parking_logs';
  const username = process.env.MONGODB_USER || 'root';
  const password = process.env.MONGODB_PASSWORD || 'root1234';
  const authSource = process.env.MONGODB_AUTH_SOURCE || 'admin';

  const rawUri = process.env.MONGODB_URI;

  if (rawUri) {
    try {
      const normalized = new URL(rawUri);

      if (!normalized.username) {
        normalized.username = username;
      }

      if (!normalized.password) {
        normalized.password = password;
      }

      if (!normalized.searchParams.has('authSource')) {
        normalized.searchParams.set('authSource', authSource);
      }

      return normalized.toString();
    } catch {
      return rawUri.includes('@')
        ? rawUri
        : `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`;
    }
  }

  return `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=${authSource}`;
};


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
    uri: buildMongoUri(),
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};
