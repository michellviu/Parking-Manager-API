import { Request, Response } from 'express';
import logger from '../../infrastructure/logger/winston.logger';

export class LogController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const options = {
        // Por defecto últimos 30 días
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        until: new Date(),
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 50,
        start: req.query.start ? parseInt(req.query.start as string, 10) : 0,
        order: (req.query.order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
        fields: ['message', 'level', 'timestamp', 'meta', 'action', 'userId', 'vehicleId', 'spotNumber'],
      };

      logger.query(options, (err, results) => {
        if (err) {
          res.status(500).json({ message: 'Error querying logs', error: err.message });
          return;
        }

        const logs = results && results.mongodb ? results.mongodb : results;
        
        res.status(200).json(logs);
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error internal when querying logs', error: error.message });
    }
  }
}
