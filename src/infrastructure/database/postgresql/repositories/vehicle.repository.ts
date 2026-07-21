import { Repository } from 'typeorm';
import { IVehicleRepository } from '../../../../domain/interfaces/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../../../domain/entities/vehicle.entity';
import { VehicleModel } from '../models/vehicle.model';
import { PostgresDataSource } from '../postgresql.config';


export class VehicleRepository implements IVehicleRepository {
  private readonly repository: Repository<VehicleModel>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(VehicleModel);
  }

  async findAll(): Promise<VehicleEntity[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<VehicleEntity | null> {
    return this.repository.findOneBy({ id });
  }

  async findByUserId(userId: string): Promise<VehicleEntity[]> {
    return this.repository.findBy({ userId });
  }

  async findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null> {
    return this.repository.findOneBy({ licensePlate });
  }

  async create(vehicleData: Partial<VehicleEntity>): Promise<VehicleEntity> {
    const vehicle = this.repository.create(vehicleData as Partial<VehicleModel>);
    return this.repository.save(vehicle);
  }

  async update(id: string, data: Partial<VehicleEntity>): Promise<VehicleEntity | null> {
    await this.repository.update(id, data as Partial<VehicleModel>);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
