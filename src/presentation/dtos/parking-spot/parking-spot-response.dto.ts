
export interface ParkingSpotResponseDto {
  id: string;
  spotNumber: string;
  floor: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function toParkingSpotResponseDto(spot: {
  id: string;
  spotNumber: string;
  floor: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ParkingSpotResponseDto {
  return {
    id: spot.id,
    spotNumber: spot.spotNumber,
    floor: spot.floor,
    isActive: spot.isActive,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  };
}
