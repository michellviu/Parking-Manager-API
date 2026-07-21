
export interface VehicleEntity {
  id: string;
  licensePlate: string;
  brand?: string;
  model?: string;
  color?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
