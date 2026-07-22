
export interface VehicleResponseDto {
  id: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  color?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export function toVehicleResponseDto(vehicle: {
  id: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  color?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}): VehicleResponseDto {
  return {
    id: vehicle.id,
    licensePlate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
    color: vehicle.color,
    userId: vehicle.userId,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}
