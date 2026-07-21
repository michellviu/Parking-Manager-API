import jwt from 'jsonwebtoken';
import { IAuthService } from '../../domain/interfaces/services/auth.service.interface';
import { environment } from '../../config/environment';


export class JwtService implements IAuthService {
  generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, environment.jwt.secret, {
      expiresIn: environment.jwt.expiresIn as any,
    });
  }

  verifyToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, environment.jwt.secret) as {
        userId: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch {
      return null;
    }
  }
}
