import request from 'supertest';
import app from '../../src/app';

describe('Caso de Uso 1: Reservar una plaza de aparcamiento', () => {
  let clientToken: string;
  let clientId: string;
  let vehicleId: string;
  let parkingSpotId: string;

  beforeAll(async () => {
    // 1. Crear usuario cliente y autenticarse
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Client 1',
      email: 'client1@test.com',
      phone: '123456789',
      password: 'password123',
      role: 'client',
    });
    clientToken = userRes.body.token;
    clientId = userRes.body.user.id;

    // 2. Crear un vehículo
    const vehicleRes = await request(app)
      .post('/api/vehicles')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        licensePlate: 'ABC-123',
        brand: 'Toyota',
        model: 'Corolla',
        color: 'Red',
      });
    vehicleId = vehicleRes.body.vehicle.id;

    // 3. Crear plaza de aparcamiento (requiere admin)
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin',
      email: 'admin_res@test.com',
      phone: '000',
      password: 'admin',
      role: 'admin',
    });
    const adminToken = adminRes.body.token;

    const spotRes = await request(app)
      .post('/api/parking-spots')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        spotNumber: 'R-01',
        floor: 1,
      });
    parkingSpotId = spotRes.body.parkingSpot.id;
  });

  it('Debe permitir al cliente reservar una plaza disponible', async () => {
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1); // Dentro de 1 hora
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2); // 2 horas de duración

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        vehicleId,
        parkingSpotId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.reservation).toHaveProperty('id');
    expect(res.body.reservation.status).toBe('active');
  });

  it('No debe permitir reservar si hay solapamiento de horario', async () => {
    // Intentar reservar en el mismo horario que la prueba anterior
    const startTime = new Date();
    startTime.setHours(startTime.getHours() + 1);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        vehicleId,
        parkingSpotId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('There is already an active reservation');
  });
});
