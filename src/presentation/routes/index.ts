import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { Role } from '../../domain/enums/role.enum';

import {
  UserRepository,
  VehicleRepository,
  ParkingSpotRepository,
  ReservationRepository,
  JwtService,
  BcryptService,
} from '../../infrastructure';

import {
  AuthManager,
  UserManager,
  VehicleManager,
  ParkingSpotManager,
  ReservationManager,
} from '../../services';

import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { VehicleController } from '../controllers/vehicle.controller';
import { ParkingSpotController } from '../controllers/parking-spot.controller';
import { ReservationController } from '../controllers/reservation.controller';
import { LogController } from '../controllers/log.controller';


const userRepository = new UserRepository();
const vehicleRepository = new VehicleRepository();
const parkingSpotRepository = new ParkingSpotRepository();
const reservationRepository = new ReservationRepository();
const jwtService = new JwtService();
const bcryptService = new BcryptService();


const authManager = new AuthManager(userRepository, jwtService, bcryptService);
const userManager = new UserManager(userRepository, bcryptService);
const vehicleManager = new VehicleManager(vehicleRepository);
const parkingSpotManager = new ParkingSpotManager(
  parkingSpotRepository,
  reservationRepository,
);
const reservationManager = new ReservationManager(
  reservationRepository,
  parkingSpotRepository,
  vehicleRepository,
);

const authController = new AuthController(authManager);
const userController = new UserController(userManager);
const vehicleController = new VehicleController(vehicleManager);
const parkingSpotController = new ParkingSpotController(parkingSpotManager);
const reservationController = new ReservationController(reservationManager);
const logController = new LogController();

export const router = Router();


import { roleMiddleware as rMiddleware } from '../middlewares/role.middleware';

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: User registration
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [client, employee, admin]
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Invalid input data
 */
router.post('/auth/register', authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 *       '401':
 *         description: Invalid credentials
 */
router.post('/auth/login', authController.login);

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users
 *     description: Get a list of all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of users
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get('/users', authMiddleware, rMiddleware(Role.ADMIN), userController.findAll);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 */
router.get('/users/:id', authMiddleware, rMiddleware(Role.ADMIN), userController.findById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     description: Update a user's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [client, employee, admin]
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 */
router.put('/users/:id', authMiddleware, rMiddleware(Role.ADMIN), userController.update);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     description: Delete a user by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 */
router.delete('/users/:id', authMiddleware, rMiddleware(Role.ADMIN), userController.delete);

/**
 * @openapi
 * /api/vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Create a new vehicle
 *     description: Create a new vehicle for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Vehicle created successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post('/vehicles', authMiddleware, rMiddleware(Role.CLIENT, Role.ADMIN), vehicleController.create);

/**
 * @openapi
 * /api/vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: List all vehicles
 *     description: Get a list of all vehicles. Admins and employees can see all vehicles, while clients can only see their own.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of vehicles
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get(
  '/vehicles',
  authMiddleware,
  rMiddleware(Role.CLIENT, Role.ADMIN, Role.EMPLOYEE),
  vehicleController.findAll,
);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get vehicle by ID
 *     description: Retrieve a vehicle by its ID. Admins and employees can see all vehicles, while clients can only see their own.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vehicle found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Vehicle not found
 */
router.get(
  '/vehicles/:id',
  authMiddleware,
  rMiddleware(Role.CLIENT, Role.ADMIN, Role.EMPLOYEE),
  vehicleController.findById,
);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   put:
 *     tags: [Vehicles]
 *     summary: Update vehicle
 *     description: Update a vehicle's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               licensePlate:
 *                 type: string
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Vehicle updated successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Vehicle not found
 */
router.put('/vehicles/:id', authMiddleware, rMiddleware(Role.CLIENT, Role.ADMIN), vehicleController.update);

/**
 * @openapi
 * /api/vehicles/{id}:
 *   delete:
 *     tags: [Vehicles]
 *     summary: Delete vehicle
 *     description: Delete a vehicle by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Vehicle deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Vehicle not found
 */
router.delete('/vehicles/:id', authMiddleware, rMiddleware(Role.CLIENT, Role.ADMIN), vehicleController.delete);

/**
 * @openapi
 * /api/parking-spots/occupation:
 *   get:
 *     tags: [Parking Spots]
 *     summary: Get parking spot occupation
 *     description: Retrieve the current occupation status of parking spots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Occupation status retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get(
  '/parking-spots/occupation',
  authMiddleware,
  rMiddleware(Role.EMPLOYEE, Role.ADMIN),
  parkingSpotController.getOccupation,
);

/**
 * @openapi
 * /api/parking-spots:
 *   post:
 *     tags: [Parking Spots]
 *     summary: Create a new parking spot
 *     description: Create a new parking spot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spotNumber:
 *                 type: string
 *               floor:
 *                 type: string
 *               isActive:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Parking spot created successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post(
  '/parking-spots',
  authMiddleware,
  rMiddleware(Role.ADMIN, Role.EMPLOYEE),
  parkingSpotController.create,
);

/**
 * @openapi
 * /api/parking-spots:
 *   get:
 *     tags: [Parking Spots]
 *     summary: List all parking spots
 *     description: Get a list of all parking spots
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of parking spots
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get(
  '/parking-spots',
  authMiddleware,
  rMiddleware(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT),
  parkingSpotController.findAll,
);

/**
 * @openapi
 * /api/parking-spots/{id}:
 *   get:
 *     tags: [Parking Spots]
 *     summary: Get parking spot by ID
 *     description: Retrieve a parking spot by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Parking spot found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Parking spot not found
 */
router.get(
  '/parking-spots/:id',
  authMiddleware,
  rMiddleware(Role.ADMIN, Role.EMPLOYEE, Role.CLIENT),
  parkingSpotController.findById,
);

/**
 * @openapi
 * /api/parking-spots/{id}:
 *   put:
 *     tags: [Parking Spots]
 *     summary: Update parking spot
 *     description: Update a parking spot's information
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spotNumber:
 *                 type: string
 *               floor:
 *                 type: string
 *               isActive:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Parking spot updated successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Parking spot not found
 */
router.put(
  '/parking-spots/:id',
  authMiddleware,
  rMiddleware(Role.ADMIN, Role.EMPLOYEE),
  parkingSpotController.update,
);

/**
 * @openapi
 * /api/parking-spots/{id}:
 *   delete:
 *     tags: [Parking Spots]
 *     summary: Delete parking spot
 *     description: Delete a parking spot by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Parking spot deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Parking spot not found
 */
router.delete(
  '/parking-spots/:id',
  authMiddleware,
  rMiddleware(Role.ADMIN),
  parkingSpotController.delete,
);

/**
 * @openapi
 * /api/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a new reservation
 *     description: Create a new reservation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *               parkingSpotId:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Reservation created successfully
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.post('/reservations', authMiddleware, rMiddleware(Role.CLIENT), reservationController.create);

/**
 * @openapi
 * /api/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: List all reservations
 *     description: Get a list of all reservations. Admins and employees can see all reservations, while clients can only see their own.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of reservations
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get(
  '/reservations',
  authMiddleware,
  rMiddleware(Role.CLIENT, Role.ADMIN, Role.EMPLOYEE),
  reservationController.findAll,
);

/**
 * @openapi
 * /api/reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservation by ID
 *     description: Retrieve a reservation by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reservation found
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Reservation not found
 */
router.get(
  '/reservations/:id',
  authMiddleware,
  rMiddleware(Role.CLIENT, Role.ADMIN, Role.EMPLOYEE),
  reservationController.findById,
);

/**
 * @openapi
 * /api/reservations/{id}/cancel:
 *   put:
 *     tags: [Reservations]
 *     summary: Cancel reservation
 *     description: Cancel a reservation by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reservation canceled successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Reservation not found
 */
router.put(
  '/reservations/:id/cancel',
  authMiddleware,
  rMiddleware(Role.CLIENT, Role.ADMIN),
  reservationController.cancel,
);

/**
 * @openapi
 * /api/reservations/{id}:
 *   delete:
 *     tags: [Reservations]
 *     summary: Delete reservation
 *     description: Delete a reservation by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Reservation deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Reservation not found
 */
router.delete(
  '/reservations/:id',
  authMiddleware,
  rMiddleware(Role.ADMIN),
  reservationController.delete,
);

/**
 * @openapi
 * /api/logs:
 *   get:
 *     tags: [System]
 *     summary: Get system logs
 *     description: Retrieve system logs for monitoring and debugging purposes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of logs returned when using offset pagination
 *       - in: query
 *         name: start
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Zero-based offset. start=0 returns from the first log, start=1 skips the first log
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Optional page number when you want page-based pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Optional page size when using page-based pagination
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [desc, asc]
 *           default: desc
 *         description: Order of logs (descending or ascending)
 *     responses:
 *       '200':
 *         description: Logs retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get('/logs', authMiddleware, rMiddleware(Role.ADMIN), logController.findAll);
