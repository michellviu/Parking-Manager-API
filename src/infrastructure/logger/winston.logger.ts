import winston from 'winston';
import 'winston-mongodb';
import { environment } from '../../config/environment';

const { combine, timestamp, printf, metadata } = winston.format;

const customFormat = printf(({ level, message, timestamp, metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (metadata && Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: environment.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
    new winston.transports.MongoDB({
      level: 'info',
      db: environment.mongodb.uri,
      options: {
        useUnifiedTopology: true,
      },
      collection: 'winston_logs',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

export default logger;
