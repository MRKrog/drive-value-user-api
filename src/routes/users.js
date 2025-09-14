const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
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

// Admin routes
router.get('/', requireRole('admin'), getAllUsers);
router.get('/:id', requireRole('admin'), getUserById);
router.put('/:id/role', requireRole('admin'), updateUserRole);
router.delete('/:id', requireRole('admin'), deleteUser);

module.exports = router;
