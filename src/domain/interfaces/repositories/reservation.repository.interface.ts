import { ReservationEntity } from '../../entities/reservation.entity';


export interface IReservationRepository {
  findAll(): Promise<ReservationEntity[]>;
  findById(id: string): Promise<ReservationEntity | null>;
  findByUserId(userId: string): Promise<ReservationEntity[]>;
  findActiveBySpotAndTimeRange(
    parkingSpotId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<ReservationEntity[]>;
  countActiveReservations(): Promise<number>;
  create(reservation: Partial<ReservationEntity>): Promise<ReservationEntity>;
  update(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity | null>;
  delete(id: string): Promise<boolean>;
}
