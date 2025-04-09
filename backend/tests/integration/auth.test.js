const request = require('supertest');
const { app, startServer, closeServer } = require('../../src/server');
const db = require('../../src/config/database');

beforeAll(async () => {
  await startServer();
  await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
});

afterEach(async () => {
  await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
});

afterAll(async () => {
  await closeServer();
});

describe('Test Auth API', () => {
  it('POST /api/auth/register doit retourner 201 et un utilisateur', async () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', user.email);
  });

  it('POST /api/auth/register avec email existant doit retourner 409', async () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    await request(app).post('/api/auth/register').send(user);
    const res = await request(app)
      .post('/api/auth/register')
      .send(user);

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message');
  });
});
