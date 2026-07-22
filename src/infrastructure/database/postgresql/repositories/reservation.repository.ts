import { Repository, LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { IReservationRepository } from '../../../../domain/interfaces/repositories/reservation.repository.interface';
import { ReservationEntity } from '../../../../domain/entities/reservation.entity';
import { ReservationModel } from '../models/reservation.model';
import { ReservationStatus } from '../../../../domain/enums/reservation-status.enum';
import { PostgresDataSource } from '../postgresql.config';


export class ReservationRepository implements IReservationRepository {
  private readonly repository: Repository<ReservationModel>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(ReservationModel);
  }

  async findAll(): Promise<ReservationEntity[]> {
    return this.repository.find({
      relations: { vehicle: true, parkingSpot: true, user: true },
    });
  }

  async findById(id: string): Promise<ReservationEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: { vehicle: true, parkingSpot: true, user: true },
    });
  }

  async findByUserId(userId: string): Promise<ReservationEntity[]> {
    return this.repository.find({
      where: { userId },
      relations: { vehicle: true, parkingSpot: true, user: true },
    });
  }


  async findActiveBySpotAndTimeRange(
    parkingSpotId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<ReservationEntity[]> {
    return this.repository.find({
      where: {
        parkingSpotId,
        status: ReservationStatus.ACTIVE,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });
  }

  async countActiveReservations(): Promise<number> {
    const now = new Date();

    return this.repository.count({
      where: {
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
      },
    });
  }

  async create(reservationData: Partial<ReservationEntity>): Promise<ReservationEntity> {
    const reservation = this.repository.create(reservationData as Partial<ReservationModel>);
    return this.repository.save(reservation);
  }

  async update(id: string, data: Partial<ReservationEntity>): Promise<ReservationEntity | null> {
    await this.repository.update(id, data as Partial<ReservationModel>);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
