import { Role } from '../enums/role.enum';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
