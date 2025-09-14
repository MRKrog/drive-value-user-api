const express = require('express');
const router = express.Router();
const {
  googleAuth,
  getMe,
  logout,
  refreshToken,
  verifyToken
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/google', googleAuth);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', authenticateToken, refreshToken);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
