import { DataSource } from 'typeorm';
import { environment } from '../../../config/environment';
import { UserModel } from './models/user.model';
import { VehicleModel } from './models/vehicle.model';
import { ParkingSpotModel } from './models/parking-spot.model';
import { ReservationModel } from './models/reservation.model';


const isTestEnvironment = environment.nodeEnv === 'test' || !!process.env.JEST_WORKER_ID;


export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: environment.postgres.host,
  port: environment.postgres.port,
  username: environment.postgres.username,
  password: environment.postgres.password,
  database: environment.postgres.database,
  dropSchema: isTestEnvironment,
  synchronize: true,
  logging: environment.nodeEnv === 'development',
  entities: [UserModel, VehicleModel, ParkingSpotModel, ReservationModel],
});
