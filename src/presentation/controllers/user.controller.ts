import { Request, Response } from 'express';
import { UserManager } from '../../services/managers/user.manager';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { toUserResponseDto } from '../dtos/user/user-response.dto';


export class UserController {
  constructor(private readonly userManager: UserManager) { }

  /**
   * GET /api/users
   */
  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userManager.findAll();
      res.status(200).json(users.map(toUserResponseDto));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching users';
      res.status(500).json({ message });
    }
  };

  /**
   * GET /api/users/:id
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userManager.findById(req.params.id as string);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json(toUserResponseDto(user));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching user';
      res.status(500).json({ message });
    }
  };

  /**
   * PUT /api/users/:id
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: UpdateUserDto = req.body;
      const performedByUserId = req.user!.userId;

      const user = await this.userManager.update(req.params.id as string, dto, performedByUserId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'User updated successfully',
        user: toUserResponseDto(user),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating user';
      res.status(400).json({ message });
    }
  };

  /**
   * DELETE /api/users/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const performedByUserId = req.user!.userId;
      const result = await this.userManager.delete(req.params.id as string, performedByUserId);

      if (!result) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting user';
      res.status(500).json({ message });
    }
  };
}
