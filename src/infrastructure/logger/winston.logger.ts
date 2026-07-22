import winston from 'winston';
import 'winston-mongodb';
import { environment } from '../../config/environment';

const { combine, timestamp, printf, metadata } = winston.format;

const promoteMetadata = winston.format((info) => {
  if (info.metadata && !info.meta) {
    info.meta = info.metadata;
  }

  return info;
});

const customFormat = printf(({ level, message, timestamp, meta, metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  const payload = meta || metadata;

  if (payload && Object.keys(payload).length > 0) {
    msg += ` ${JSON.stringify(payload)}`;
  }
  return msg;
});

export const logger = winston.createLogger({
  level: environment.nodeEnv === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    promoteMetadata()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        winston.format.colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        promoteMetadata(),
        customFormat
      ),
    }),
    ...(environment.nodeEnv === 'test'
      ? []
      : [
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
          }),
        ]),
  ]
});

export default logger;
