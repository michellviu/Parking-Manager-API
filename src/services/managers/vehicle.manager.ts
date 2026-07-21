import { IVehicleRepository } from '../../domain/interfaces/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';


export class VehicleManager {
  constructor(
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async findAll(): Promise<VehicleEntity[]> {
    return this.vehicleRepository.findAll();
  }

  async findById(id: string): Promise<VehicleEntity | null> {
    return this.vehicleRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<VehicleEntity[]> {
    return this.vehicleRepository.findByUserId(userId);
  }

  async create(vehicleData: Partial<VehicleEntity>): Promise<VehicleEntity> {
  
    if (vehicleData.licensePlate) {
      const existing = await this.vehicleRepository.findByLicensePlate(vehicleData.licensePlate);
      if (existing) {
        throw new Error('A vehicle with that license plate already exists');
      }
    }

    return this.vehicleRepository.create(vehicleData);
  }

  async update(id: string, data: Partial<VehicleEntity>): Promise<VehicleEntity | null> {
  
    if (data.licensePlate) {
      const existing = await this.vehicleRepository.findByLicensePlate(data.licensePlate);
      if (existing && existing.id !== id) {
        throw new Error('A vehicle with that license plate already exists');
      }
    }

    return this.vehicleRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.vehicleRepository.delete(id);
  }
}
