const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserStats,
  updateUserSubscription,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/stats', updateUserStats);
router.put('/subscription', updateUserSubscription);

// Admin routes
router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id', requireRole('admin'), getUserById);
router.put('/:id/role', requireRole('admin'), updateUserRole);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
