import request from 'supertest';
import app from '../../src/app';

describe('Caso de Uso 2: Consultar la ocupación del parking', () => {
  let employeeToken: string;

  beforeAll(async () => {
    // 1. Crear un empleado para hacer la consulta
    const empRes = await request(app).post('/api/auth/register').send({
      name: 'Empleado',
      email: 'employee_occ@test.com',
      phone: '111',
      password: 'password',
      role: 'employee',
    });
    employeeToken = empRes.body.token;

    // 2. Crear admin para registrar plazas
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin',
      email: 'admin_occ@test.com',
      phone: '000',
      password: 'admin',
      role: 'admin',
    });
    const adminToken = adminRes.body.token;

    // 3. Crear un par de plazas
    await request(app)
      .post('/api/parking-spots')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ spotNumber: 'O-01', floor: 1 });
    await request(app)
      .post('/api/parking-spots')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ spotNumber: 'O-02', floor: 1 });
  });

  it('El empleado debe poder obtener la ocupación actual', async () => {
    const res = await request(app)
      .get('/api/parking-spots/occupation')
      .set('Authorization', `Bearer ${employeeToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalSpots');
    expect(res.body).toHaveProperty('activeReservations');
    expect(res.body).toHaveProperty('availableSpots');
    expect(res.body).toHaveProperty('occupancyPercentage');
    
    // Al menos las plazas creadas arriba
    expect(res.body.totalSpots).toBeGreaterThanOrEqual(2); 
  });
});
