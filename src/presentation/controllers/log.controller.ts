import { Request, Response } from 'express';
import { LogModel } from '../../infrastructure';

const DEFAULT_LOG_WINDOW_DAYS = 30;
const MAX_LIMIT = 200;

export class LogController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const rawLimit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const rawStart = req.query.start ? parseInt(req.query.start as string, 10) : undefined;
      const rawPage = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
      const rawPageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined;

      const limit = Math.min(Math.max(rawPageSize ?? rawLimit ?? 50, 1), MAX_LIMIT);
      const start = Math.max(rawStart ?? (((rawPage ?? 1) - 1) * limit), 0);
      const order = req.query.order === 'asc' ? 1 : -1;

      const from = req.query.from
        ? new Date(req.query.from as string)
        : new Date(Date.now() - DEFAULT_LOG_WINDOW_DAYS * 24 * 60 * 60 * 1000);
      const until = req.query.until ? new Date(req.query.until as string) : new Date();

      if (Number.isNaN(from.getTime()) || Number.isNaN(until.getTime())) {
        res.status(400).json({ message: 'Invalid date range' });
        return;
      }

      const logs = await LogModel.find({
        timestamp: {
          $gte: from,
          $lte: until,
        },
      })
        .sort({ timestamp: order })
        .skip(start)
        .limit(limit)
        .lean()
        .exec();

      const normalizedLogs = logs.map((log) => {
        const metadata = log.metadata && typeof log.metadata === 'object' && !Array.isArray(log.metadata)
          ? (log.metadata as Record<string, unknown>)
          : undefined;

        return {
          message: log.message,
          level: log.level,
          timestamp: log.timestamp,
          metadata,
          action: metadata?.action as string | undefined,
          userId: metadata?.userId as string | undefined,
          vehicleId: metadata?.vehicleId as string | undefined,
          spotNumber: metadata?.spotNumber as string | undefined,
        };
      });

      res.status(200).json({
        items: normalizedLogs,
        pagination: {
          start,
          limit,
          page: rawPage ?? Math.floor(start / limit) + 1,
          pageSize: limit,
          returned: normalizedLogs.length,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error internal when querying logs', error: error.message });
    }
  }
}
