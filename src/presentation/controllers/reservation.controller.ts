import { Request, Response } from 'express';
import { ReservationManager } from '../../services/managers/reservation.manager';
import { CreateReservationDto } from '../dtos/reservation/create-reservation.dto';
import { toReservationResponseDto } from '../dtos/reservation/reservation-response.dto';


export class ReservationController {
  constructor(private readonly reservationManager: ReservationManager) {}

  /**
   * POST /api/reservations
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: CreateReservationDto = req.body;

      if (!dto.vehicleId || !dto.parkingSpotId || !dto.startTime || !dto.endTime) {
        res.status(400).json({
          message: 'All fields are required: vehicleId, parkingSpotId, startTime, endTime',
        });
        return;
      }

      if (Date.parse(dto.startTime) < Date.now() || Date.parse(dto.endTime) < Date.now()) {
        res.status(400).json({ message: 'Start time and end time must be in the future' });
        return;
      }

      const reservation = await this.reservationManager.createReservation(
        dto.vehicleId,
        dto.parkingSpotId,
        req.user!.userId,
        new Date(dto.startTime),
        new Date(dto.endTime),
      );

      res.status(201).json({
        message: 'Reservation created successfully',
        reservation: toReservationResponseDto(reservation),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating reservation';
      res.status(400).json({ message });
    }
  };

  /**
   * GET /api/reservations
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let reservations;

      if (req.user!.role === 'client') {
        reservations = await this.reservationManager.findByUserId(req.user!.userId);
      } else {
        reservations = await this.reservationManager.findAll();
      }

      res.status(200).json(reservations.map(toReservationResponseDto));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching reservations';
      res.status(500).json({ message });
    }
  };

  /**
   * GET /api/reservations/:id
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationManager.findById(req.params.id as string);

      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      if (req.user!.role === 'client' && reservation.userId !== req.user!.userId) {
        res.status(403).json({ message: 'You are not the owner of this reservation' });
        return;
      }

      res.status(200).json(toReservationResponseDto(reservation));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error fetching reservation';
      res.status(500).json({ message });
    }
  };

  /**
   * PUT /api/reservations/:id/cancel
   */
  cancel = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationManager.cancelReservation(
        req.params.id as string,
        req.user!.userId,
      );

      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      res.status(200).json({
        message: 'Reservation cancelled successfully',
        reservation: toReservationResponseDto(reservation),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error cancelling reservation';
      res.status(400).json({ message });
    }
  };

  /**
   * DELETE /api/reservations/:id
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.reservationManager.delete(req.params.id as string);

      if (!result) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }

      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting reservation';
      res.status(500).json({ message });
    }
  };
}
