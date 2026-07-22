import { Request, Response } from 'express';
import { AuthManager } from '../../services/managers/auth.manager';
import { RegisterDto } from '../dtos/auth/register.dto';
import { LoginDto } from '../dtos/auth/login.dto';
import { toUserResponseDto } from '../dtos/user/user-response.dto';
import { Role } from '../../domain/enums/role.enum';


export class AuthController {
  constructor(private readonly authManager: AuthManager) { }

  /**
   * POST /api/auth/register
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: RegisterDto = req.body;

      if (!dto.name || !dto.email || !dto.phone || !dto.password) {
        res.status(400).json({ message: 'All fields are required: name, email, phone, password' });
        return;
      }

      const role = dto.role ? (dto.role as Role) : Role.CLIENT;
      if (dto.role && !Object.values(Role).includes(role)) {
        res.status(400).json({ message: `Invalid role. Allowed roles: ${Object.values(Role).join(', ')}` });
        return;
      }

      const result = await this.authManager.register(
        dto.name,
        dto.email,
        dto.phone,
        dto.password,
        role,
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: toUserResponseDto(result.user),
        token: result.token,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error registering user';
      res.status(400).json({ message });
    }
  };

  /**
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: LoginDto = req.body;

      if (!dto.email || !dto.password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }

      const result = await this.authManager.login(dto.email, dto.password);

      res.status(200).json({
        message: 'Login successful',
        user: toUserResponseDto(result.user),
        token: result.token,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error logging in';
      res.status(401).json({ message });
    }
  };
}
