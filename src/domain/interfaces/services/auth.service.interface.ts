
export interface IAuthService {
  generateToken(payload: { userId: string; email: string; role: string }): string;
  verifyToken(token: string): { userId: string; email: string; role: string } | null;
}
