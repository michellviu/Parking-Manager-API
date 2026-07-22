import mongoose, { Schema } from 'mongoose';

export interface ILogDocument {
  message: string;
  level: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const logSchema = new Schema<ILogDocument>(
  {
    message: { type: String, required: true },
    level: { type: String, required: true },
    timestamp: { type: Date, required: true, index: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    collection: 'winston_logs',
    versionKey: false,
    strict: false,
  },
);

logSchema.index({ timestamp: -1 });

export const LogModel = mongoose.models.WinstonLog || mongoose.model<ILogDocument>('WinstonLog', logSchema);