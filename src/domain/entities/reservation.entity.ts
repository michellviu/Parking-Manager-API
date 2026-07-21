import { ReservationStatus } from '../enums/reservation-status.enum';

export interface ReservationEntity {
  id: string;
  vehicleId: string;
  parkingSpotId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}
