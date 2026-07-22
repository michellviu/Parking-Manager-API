import request from 'supertest';
import app from '../../src/app';

describe('Caso de Uso 3: Actualizar los detalles de un usuario', () => {
  let adminToken: string;
  let targetUserId: string;

  beforeAll(async () => {
    // 1. Crear el admin
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin Update',
      email: 'admin_upd@test.com',
      phone: '000',
      password: 'admin',
      role: 'admin',
    });
    adminToken = adminRes.body.token;

    // 2. Crear usuario objetivo
    const targetRes = await request(app).post('/api/auth/register').send({
      name: 'Old Name',
      email: 'old@test.com',
      phone: '111',
      password: 'password',
      role: 'client',
    });
    targetUserId = targetRes.body.user.id;
  });

  it('El admin debe poder actualizar el nombre y email del usuario', async () => {
    const res = await request(app)
      .put(`/api/users/${targetUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Name',
        email: 'new@test.com',
      });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('New Name');
    expect(res.body.user.email).toBe('new@test.com');
  });

  it('No debe permitir a un cliente normal actualizar otro usuario', async () => {
    const clientRes = await request(app).post('/api/auth/register').send({
      name: 'Nosey Client',
      email: 'nosey@test.com',
      phone: '222',
      password: 'password',
      role: 'client',
    });
    const clientToken = clientRes.body.token;

    const res = await request(app)
      .put(`/api/users/${targetUserId}`)
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        name: 'Hacked',
      });

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('You do not have permission');
  });
});
