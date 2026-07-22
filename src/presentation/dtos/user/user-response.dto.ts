
export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}


export function toUserResponseDto(user: {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
