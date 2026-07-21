import { UserEntity } from '../../entities/user.entity';


export interface IUserRepository {
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>;
  delete(id: string): Promise<boolean>;
}
