import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { IAuthService } from '../../domain/interfaces/services/auth.service.interface';
import { IPasswordHasher } from '../../domain/interfaces/services/password-hasher.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { Role } from '../../domain/enums/role.enum';
import { LogAction } from '../../domain/enums/log-action.enum';
import logger from '../../infrastructure/logger/winston.logger';


export class AuthManager {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
    private readonly passwordHasher: IPasswordHasher,
  ) {}


  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    role: Role = Role.CLIENT,
  ): Promise<{ user: UserEntity; token: string }> {
   
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('The email is already registered.');
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const user = await this.userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    logger.info(`User ${user.email} registered successfully`, {
      action: LogAction.REGISTER,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }


  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserEntity; token: string }> {

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    logger.info(`User ${user.email} logged in successfully`, {
      action: LogAction.LOGIN,
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
