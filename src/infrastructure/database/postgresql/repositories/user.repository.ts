import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../domain/interfaces/repositories/user.repository.interface';
import { UserEntity } from '../../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { PostgresDataSource } from '../postgresql.config';


export class UserRepository implements IUserRepository {
  private readonly repository: Repository<UserModel>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(UserModel);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOneBy({ email });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.repository.create(userData as Partial<UserModel>);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.repository.update(id, data as Partial<UserModel>);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
