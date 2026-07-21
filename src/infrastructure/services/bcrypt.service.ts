import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/interfaces/services/password-hasher.interface';


export class BcryptService implements IPasswordHasher {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
