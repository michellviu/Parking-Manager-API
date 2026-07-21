import { VehicleEntity } from '../../entities/vehicle.entity';

export interface IVehicleRepository {
  findAll(): Promise<VehicleEntity[]>;
  findById(id: string): Promise<VehicleEntity | null>;
  findByUserId(userId: string): Promise<VehicleEntity[]>;
  findByLicensePlate(licensePlate: string): Promise<VehicleEntity | null>;
  create(vehicle: Partial<VehicleEntity>): Promise<VehicleEntity>;
  update(id: string, data: Partial<VehicleEntity>): Promise<VehicleEntity | null>;
  delete(id: string): Promise<boolean>;
}
