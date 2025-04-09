const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { register, login } = require('../../src/controllers/authController');

// Mock des dépendances
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/database', () => ({
  query: jest.fn()
}));

describe('Auth Controller - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    it('should reject missing fields', async () => {
      const req = { body: { name: '', email: '', password: '' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      await register(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tous les champs sont requis' });
    });

    it('should hash password and create user', async () => {
      const req = { body: { name: 'Test', email: 'test@example.com', password: 'password123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Mock de la DB et bcrypt
      require('../../src/config/database').query
        .mockResolvedValueOnce({ rows: [] }) // Aucun utilisateur existant
        .mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test', email: 'test@example.com' }] });

      bcrypt.hash.mockResolvedValue('hashed123');

      await register(req, res, next);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('login()', () => {
    it('should reject invalid credentials', async () => {
      const req = { body: { email: 'wrong@example.com', password: 'wrong' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      require('../../src/config/database').query.mockResolvedValue({ rows: [] });

      await login(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});