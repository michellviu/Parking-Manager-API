import { ParkingSpotEntity } from '../../entities/parking-spot.entity';


export interface IParkingSpotRepository {
  findAll(): Promise<ParkingSpotEntity[]>;
  findById(id: string): Promise<ParkingSpotEntity | null>;
  findBySpotNumber(spotNumber: string): Promise<ParkingSpotEntity | null>;
  findAvailable(): Promise<ParkingSpotEntity[]>;
  create(spot: Partial<ParkingSpotEntity>): Promise<ParkingSpotEntity>;
  update(id: string, data: Partial<ParkingSpotEntity>): Promise<ParkingSpotEntity | null>;
  delete(id: string): Promise<boolean>;
}
