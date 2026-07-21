import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ReservationStatus } from '../../../../domain/enums/reservation-status.enum';
import { UserModel } from './user.model';
import { VehicleModel } from './vehicle.model';
import { ParkingSpotModel } from './parking-spot.model';

@Entity('reservations')
export class ReservationModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'vehicle_id' })
  vehicleId!: string;

  @Column({ type: 'uuid', name: 'parking_spot_id' })
  parkingSpotId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime!: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime!: Date;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status!: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  
  @ManyToOne(() => UserModel, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;

  @ManyToOne(() => VehicleModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: VehicleModel;

  @ManyToOne(() => ParkingSpotModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parking_spot_id' })
  parkingSpot!: ParkingSpotModel;
}
