import mongoose from 'mongoose';
import { environment } from '../../../config/environment';

let connectionPromise: Promise<typeof mongoose> | null = null;

export const initializeMongoConnection = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(environment.mongodb.uri).catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
};