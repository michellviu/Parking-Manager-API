import { IReservationRepository } from '../../domain/interfaces/repositories/reservation.repository.interface';
import { IParkingSpotRepository } from '../../domain/interfaces/repositories/parking-spot.repository.interface';
import { IVehicleRepository } from '../../domain/interfaces/repositories/vehicle.repository.interface';
import { ReservationEntity } from '../../domain/entities/reservation.entity';
import { ReservationStatus } from '../../domain/enums/reservation-status.enum';
import { LogAction } from '../../domain/enums/log-action.enum';
import logger from '../../infrastructure/logger/winston.logger';


export class ReservationManager {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly parkingSpotRepository: IParkingSpotRepository,
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async findAll(): Promise<ReservationEntity[]> {
    return this.reservationRepository.findAll();
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    return this.reservationRepository.findById(id);
  }

  async findByUserId(userId: string): Promise<ReservationEntity[]> {
    return this.reservationRepository.findByUserId(userId);
  }

  async createReservation(
    vehicleId: string,
    parkingSpotId: string,
    userId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<ReservationEntity> {
  
    const spot = await this.parkingSpotRepository.findById(parkingSpotId);
    if (!spot) {
      throw new Error('The parking space does not exist.');
    }
    if (!spot.isActive) {
      throw new Error('The parking space is not available.');
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('The vehicle does not exist.');
    }
    if (vehicle.userId !== userId) {
      throw new Error('The vehicle does not belong to the user');
    }

    if (startTime >= endTime) {
      throw new Error('The start date must be before the end date');
    }

    const conflicts = await this.reservationRepository.findActiveBySpotAndTimeRange(
      parkingSpotId,
      startTime,
      endTime,
    );
    if (conflicts.length > 0) {
      throw new Error('There is already an active reservation for this parking space in the given time range.');
    }

    const reservation = await this.reservationRepository.create({
      vehicleId,
      parkingSpotId,
      userId,
      startTime,
      endTime,
      status: ReservationStatus.ACTIVE,
    });

    logger.info(`Reservation created for vehicle ${vehicle.licensePlate} in spot ${spot.spotNumber} from ${startTime.toISOString()} to ${endTime.toISOString()}`, {
      action: LogAction.RESERVATION,
      userId,
      vehicleId,
      spotNumber: spot.spotNumber,
    });

    return reservation;
  }


  async cancelReservation(
    reservationId: string,
    userId: string,
  ): Promise<ReservationEntity | null> {
    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new Error('The reservation does not exist.');
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new Error('Only active reservations can be cancelled.');
    }

    const updated = await this.reservationRepository.update(reservationId, {
      status: ReservationStatus.CANCELLED,
    });

    if (updated) {
      const spot = await this.parkingSpotRepository.findById(reservation.parkingSpotId);

      logger.info(`Reservation ${reservationId} cancelled by user ${userId}`, {
        action: LogAction.CANCELLATION,
        userId,
        vehicleId: reservation.vehicleId,
        spotNumber: spot?.spotNumber,
      });
    }

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.reservationRepository.delete(id);
  }
}
