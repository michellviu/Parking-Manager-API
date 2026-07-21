import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../../../domain/enums/role.enum';
import { VehicleModel } from './vehicle.model';
import { ReservationModel } from './reservation.model';


@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20 })
  phone?: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role!: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  
  @OneToMany(() => VehicleModel, (vehicle) => vehicle.user)
  vehicles!: VehicleModel[];

  @OneToMany(() => ReservationModel, (reservation) => reservation.user)
  reservations!: ReservationModel[];
}
