import { Request, Response } from 'express';
import { VehicleManager } from '../../services/managers/vehicle.manager';
import { CreateVehicleDto } from '../dtos/vehicle/create-vehicle.dto';
import { toVehicleResponseDto } from '../dtos/vehicle/vehicle-response.dto';


export class VehicleController {
  constructor(private readonly vehicleManager: VehicleManager) {}

  /**
   * POST /api/vehicles
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateVehicleDto = req.body;

      if (!dto.licensePlate) {
        res.status(400).json({ message: 'The licensePlate field is required' });
        return;
      }

      const vehicle = await this.vehicleManager.create({
        ...dto,
        userId: req.user!.userId,
      });

      res.status(201).json({
        message: 'Vehicle created successfully',
        vehicle: toVehicleResponseDto(vehicle),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating vehicle';
      res.status(400).json({ message });
    }
  };

  /**
   * GET /api/vehicles
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let vehicles;

      if (req.user!.role === 'client') {
        vehicles = await this.vehicleManager.findByUserId(req.user!.userId);
      } else {
        vehicles = await this.vehicleManager.findAll();
      }

      res.status(200).json(vehicles.map(toVehicleResponseDto));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching vehicles';
      res.status(500).json({ message });
    }
  };

  /**
   * GET /api/vehicles/:id
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleManager.findById(req.params.id as string);

      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }


      if (req.user!.role === 'client' && vehicle.userId !== req.user!.userId) {
        res.status(403).json({ message: 'You do not have permission to view this vehicle' });
        return;
      }

      res.status(200).json(toVehicleResponseDto(vehicle));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching vehicle';
      res.status(500).json({ message });
    }
  };

  /**
   * PUT /api/vehicles/:id
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleManager.findById(req.params.id as string);

      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      // Un cliente solo puede actualizar sus propios vehículos
      if (req.user!.role === 'client' && vehicle.userId !== req.user!.userId) {
        res.status(403).json({ message: 'You do not have permission to update this vehicle' });
        return;
      }

      const updated = await this.vehicleManager.update(req.params.id as string, req.body);

      if (!updated) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle: toVehicleResponseDto(updated),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating vehicle';
      res.status(400).json({ message });
    }
  };

  /**
   * DELETE /api/vehicles/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const vehicle = await this.vehicleManager.findById(req.params.id as string);

      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      if (req.user!.role === 'client' && vehicle.userId !== req.user!.userId) {
        res.status(403).json({ message: 'You do not have permission to delete this vehicle' });
        return;
      }

      await this.vehicleManager.delete(req.params.id as string);
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting vehicle';
      res.status(500).json({ message });
    }
  };
}
