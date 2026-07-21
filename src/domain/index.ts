// ── Entities ────────────────────────────────────────────────
export { UserEntity } from './entities/user.entity';
export { VehicleEntity } from './entities/vehicle.entity';
export { ParkingSpotEntity } from './entities/parking-spot.entity';
export { ReservationEntity } from './entities/reservation.entity';

// ── Enums ───────────────────────────────────────────────────
export { Role } from './enums/role.enum';
export { LogAction } from './enums/log-action.enum';
export { ReservationStatus } from './enums/reservation-status.enum';

// ── Repository Interfaces ───────────────────────────────────
export { IUserRepository } from './interfaces/repositories/user.repository.interface';
export { IVehicleRepository } from './interfaces/repositories/vehicle.repository.interface';
export { IParkingSpotRepository } from './interfaces/repositories/parking-spot.repository.interface';
export { IReservationRepository } from './interfaces/repositories/reservation.repository.interface';

// ── Service Interfaces ──────────────────────────────────────
export { IAuthService } from './interfaces/services/auth.service.interface';
export { IPasswordHasher } from './interfaces/services/password-hasher.interface';
