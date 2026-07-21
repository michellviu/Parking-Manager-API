import { IUserRepository } from '../../domain/interfaces/repositories/user.repository.interface';
import { IPasswordHasher } from '../../domain/interfaces/services/password-hasher.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { LogAction } from '../../domain/enums/log-action.enum';
import logger from '../../infrastructure/logger/winston.logger';


export class UserManager {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
    performedByUserId: string,
  ): Promise<UserEntity | null> {
  
    if (data.password) {
      data.password = await this.passwordHasher.hash(data.password);
    }

    const updatedUser = await this.userRepository.update(id, data);

    if (updatedUser) {
      logger.info(`User ${updatedUser.email} updated by user ${performedByUserId}`, {
        action: LogAction.USER_UPDATE,
        userId: performedByUserId,
      });
    }

    return updatedUser;
  }

  async delete(id: string, performedByUserId: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    const result = await this.userRepository.delete(id);

    if (result && user) {
      logger.info(`User ${user.email} deleted by user ${performedByUserId}`, {
        action: LogAction.USER_DELETE,
        userId: performedByUserId,
      });
    }

    return result;
  }
}
