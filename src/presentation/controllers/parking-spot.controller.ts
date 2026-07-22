import { Request, Response } from 'express';
import { ParkingSpotManager } from '../../services/managers/parking-spot.manager';
import { CreateParkingSpotDto } from '../dtos/parking-spot/create-parking-spot.dto';
import { toParkingSpotResponseDto } from '../dtos/parking-spot/parking-spot-response.dto';


export class ParkingSpotController {
  constructor(private readonly parkingSpotManager: ParkingSpotManager) {}

  /**
   * POST /api/parking-spots
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateParkingSpotDto = req.body;

      if (!dto.spotNumber || dto.floor === undefined) {
        res.status(400).json({ message: 'Spot number and floor are required' });
        return;
      }

      const spot = await this.parkingSpotManager.create(dto, req.user!.userId);

      res.status(201).json({
        message: 'Parking spot created successfully',
        parkingSpot: toParkingSpotResponseDto(spot),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating parking spot';
      res.status(400).json({ message });
    }
  };

  /**
   * GET /api/parking-spots
   */
  findAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const spots = await this.parkingSpotManager.findAll();
      res.status(200).json(spots.map(toParkingSpotResponseDto));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching parking spots';
      res.status(500).json({ message });
    }
  };

  /**
   * GET /api/parking-spots/:id
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const spot = await this.parkingSpotManager.findById(req.params.id as string);

      if (!spot) {
        res.status(404).json({ message: 'Parking spot not found' });
        return;
      }

      res.status(200).json(toParkingSpotResponseDto(spot));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching parking spot';
      res.status(500).json({ message });
    }
  };

 
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const spot = await this.parkingSpotManager.update(
        req.params.id as string,
        req.body,
        req.user!.userId,
      );

      if (!spot) {
        res.status(404).json({ message: 'Parking spot not found' });
        return;
      }

      res.status(200).json({
        message: 'Parking spot updated successfully',
        parkingSpot: toParkingSpotResponseDto(spot),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating parking spot';
      res.status(400).json({ message });
    }
  };

  /**
   * DELETE /api/parking-spots/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.parkingSpotManager.delete(req.params.id as string, req.user!.userId);

      if (!result) {
        res.status(404).json({ message: 'Parking spot not found' });
        return;
      }

      res.status(200).json({ message: 'Parking spot deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting parking spot';
      res.status(500).json({ message });
    }
  };

  /**
   * GET /api/parking-spots/occupation
   */
  getOccupation = async (_req: Request, res: Response): Promise<void> => {
    try {
      const occupation = await this.parkingSpotManager.getOccupation();
      res.status(200).json(occupation);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching parking spot occupation';
      res.status(500).json({ message });
    }
  };
}
