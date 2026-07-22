import { IVehicleRepository } from '../../domain/interfaces/repositories/vehicle.repository.interface';
import { VehicleEntity } from '../../domain/entities/vehicle.entity';
import { LogAction } from '../../domain/enums/log-action.enum';
import logger from '../../infrastructure/logger/winston.logger';


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

  async create(vehicleData: Partial<VehicleEntity>, performedByUserId: string): Promise<VehicleEntity> {
  
    if (vehicleData.licensePlate) {
      const existing = await this.vehicleRepository.findByLicensePlate(vehicleData.licensePlate);
      if (existing) {
        throw new Error('A vehicle with that license plate already exists');
      }
    }

    const vehicle = await this.vehicleRepository.create(vehicleData);

    logger.info(`Vehicle ${vehicle.licensePlate} created successfully`, {
      action: LogAction.VEHICLE_CREATE,
      userId: performedByUserId,
      vehicleId: vehicle.id,
      licensePlate: vehicle.licensePlate,
    });

    return vehicle;
  }

  async update(id: string, data: Partial<VehicleEntity>, performedByUserId: string): Promise<VehicleEntity | null> {
  
    if (data.licensePlate) {
      const existing = await this.vehicleRepository.findByLicensePlate(data.licensePlate);
      if (existing && existing.id !== id) {
        throw new Error('A vehicle with that license plate already exists');
      }
    }

    const vehicle = await this.vehicleRepository.update(id, data);

    if (vehicle) {
      logger.info(`Vehicle ${vehicle.licensePlate} updated successfully`, {
        action: LogAction.VEHICLE_UPDATE,
        userId: performedByUserId,
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
      });
    }

    return vehicle;
  }

  async delete(id: string, performedByUserId: string): Promise<boolean> {
    const vehicle = await this.vehicleRepository.findById(id);
    const result = await this.vehicleRepository.delete(id);

    if (result && vehicle) {
      logger.info(`Vehicle ${vehicle.licensePlate} deleted successfully`, {
        action: LogAction.VEHICLE_DELETE,
        userId: performedByUserId,
        vehicleId: vehicle.id,
        licensePlate: vehicle.licensePlate,
      });
    }

    return result;
  }
}
