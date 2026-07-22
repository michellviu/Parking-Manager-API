
export interface ReservationResponseDto {
  id: string;
  vehicleId: string;
  parkingSpotId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toReservationResponseDto(reservation: {
  id: string;
  vehicleId: string;
  parkingSpotId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): ReservationResponseDto {
  return {
    id: reservation.id,
    vehicleId: reservation.vehicleId,
    parkingSpotId: reservation.parkingSpotId,
    userId: reservation.userId,
    startTime: reservation.startTime,
    endTime: reservation.endTime,
    status: reservation.status,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt,
  };
}
