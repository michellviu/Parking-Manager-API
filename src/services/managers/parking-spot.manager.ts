import { IParkingSpotRepository } from '../../domain/interfaces/repositories/parking-spot.repository.interface';
import { IReservationRepository } from '../../domain/interfaces/repositories/reservation.repository.interface';
import { ParkingSpotEntity } from '../../domain/entities/parking-spot.entity';
import { LogAction } from '../../domain/enums/log-action.enum';
import logger from '../../infrastructure/logger/winston.logger';


export class ParkingSpotManager {
  constructor(
    private readonly parkingSpotRepository: IParkingSpotRepository,
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async findAll(): Promise<ParkingSpotEntity[]> {
    return this.parkingSpotRepository.findAll();
  }

  async findById(id: string): Promise<ParkingSpotEntity | null> {
    return this.parkingSpotRepository.findById(id);
  }

  async create(
    spotData: Partial<ParkingSpotEntity>,
    performedByUserId: string,
  ): Promise<ParkingSpotEntity> {
  
    if (spotData.spotNumber) {
      const existing = await this.parkingSpotRepository.findBySpotNumber(spotData.spotNumber);
      if (existing) {
        throw new Error('There is already a space with that number.');
      }
    }

    const spot = await this.parkingSpotRepository.create(spotData);

    logger.info(`Space ${spot.spotNumber} created on the ${spot.floor} floor`, {
      action: LogAction.SPOT_CREATE,
      userId: performedByUserId,
      spotNumber: spot.spotNumber,
    });

    return spot;
  }

  async update(
    id: string,
    data: Partial<ParkingSpotEntity>,
    performedByUserId: string,
  ): Promise<ParkingSpotEntity | null> {
    const spot = await this.parkingSpotRepository.update(id, data);

    if (spot) {
      logger.info(`Space ${spot.spotNumber} updated`, {
        action: LogAction.SPOT_UPDATE,
        userId: performedByUserId,
        spotNumber: spot.spotNumber,
      });
    }

    return spot;
  }

  async delete(id: string, performedByUserId: string): Promise<boolean> {
    const spot = await this.parkingSpotRepository.findById(id);
    const result = await this.parkingSpotRepository.delete(id);

    if (result && spot) {
      logger.info(`Space ${spot.spotNumber} deleted`, {
        action: LogAction.SPOT_DELETE,
        userId: performedByUserId,
        spotNumber: spot.spotNumber,
      });
    }

    return result;
  }


  async getOccupation(): Promise<{
    totalSpots: number;
    activeReservations: number;
    availableSpots: number;
    occupancyPercentage: number;
  }> {
    const allSpots = await this.parkingSpotRepository.findAll();
    const totalActive = allSpots.filter((s) => s.isActive).length;
    const activeReservations = await this.reservationRepository.countActiveReservations();

    const available = totalActive - activeReservations;

    return {
      totalSpots: totalActive,
      activeReservations,
      availableSpots: available > 0 ? available : 0,
      occupancyPercentage:
        totalActive > 0 ? Math.round((activeReservations / totalActive) * 100) : 0,
    };
  }
}
