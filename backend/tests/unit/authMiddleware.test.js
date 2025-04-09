const jwt = require('jsonwebtoken');
const { verifyToken, checkRole } = require('../../src/middlewares/auth');
const { mockRequest, mockResponse } = require('../helpers/mocks');

process.env.JWT_SECRET = 'test-secret';
const validToken = jwt.sign({ userId: 123, role: 'admin' }, process.env.JWT_SECRET);
const expiredToken = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, { expiresIn: '-1s' });

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    res = mockResponse();
    next = jest.fn();
  });

  describe('verifyToken()', () => {
    it('should allow access with valid token', () => {
      req = mockRequest({ headers: { authorization: `Bearer ${validToken}` } });
      verifyToken(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user.userId).toBe(123);
    });

    it('should reject requests without token', () => {
      req = mockRequest();
      verifyToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token d\'authentification requis' });
    });
  });

  describe('checkRole()', () => {
    it('should allow access for authorized roles', () => {
      req = mockRequest({ user: { role: 'admin' } });
      checkRole(['admin'])(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should reject unauthorized roles', () => {
      req = mockRequest({ user: { role: 'user' } });
      checkRole(['admin'])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});