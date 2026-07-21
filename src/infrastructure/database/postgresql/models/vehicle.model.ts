import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserModel } from './user.model';


@Entity('vehicles')
export class VehicleModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, unique: true, name: 'license_plate' })
  licensePlate!: string;

  @Column({ type: 'varchar', length: 50 })
  brand?: string;

  @Column({ type: 'varchar', length: 50 })
  model?: string;

  @Column({ type: 'varchar', length: 30 })
  color?: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;


  @ManyToOne(() => UserModel, (user) => user.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserModel;
}
