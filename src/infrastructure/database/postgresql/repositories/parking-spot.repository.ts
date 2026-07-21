import { Repository } from 'typeorm';
import { IParkingSpotRepository } from '../../../../domain/interfaces/repositories/parking-spot.repository.interface';
import { ParkingSpotEntity } from '../../../../domain/entities/parking-spot.entity';
import { ParkingSpotModel } from '../models/parking-spot.model';
import { PostgresDataSource } from '../postgresql.config';


export class ParkingSpotRepository implements IParkingSpotRepository {
  private readonly repository: Repository<ParkingSpotModel>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(ParkingSpotModel);
  }

  async findAll(): Promise<ParkingSpotEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<ParkingSpotEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findBySpotNumber(spotNumber: string): Promise<ParkingSpotEntity | null> {
    return this.repository.findOneBy({ spotNumber });
  }

  async findAvailable(): Promise<ParkingSpotEntity[]> {
    return this.repository.findBy({ isActive: true });
  }

  async create(spotData: Partial<ParkingSpotEntity>): Promise<ParkingSpotEntity> {
    const spot = this.repository.create(spotData as Partial<ParkingSpotModel>);
    return this.repository.save(spot);
  }

  async update(id: string, data: Partial<ParkingSpotEntity>): Promise<ParkingSpotEntity | null> {
    await this.repository.update(id, data as Partial<ParkingSpotModel>);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
