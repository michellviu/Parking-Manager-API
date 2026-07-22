import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/services/jwt.service';


declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

const jwtService = new JwtService();

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication token not provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwtService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Invalid or expired authentication token' });
      return;
    }

    req.user = decoded;

    next();
  } catch {
    res.status(401).json({ message: 'Authentication error' });
  }
}
