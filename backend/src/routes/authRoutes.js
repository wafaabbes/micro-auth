
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;
