const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, firstName, lastName, profilePicture } = req.body;

  // Validate input
  const updateData = {};
  
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name must be a non-empty string'
      });
    }
    updateData.name = name.trim();
  }

  if (firstName !== undefined) {
    if (typeof firstName !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'First name must be a string'
      });
    }
    updateData.firstName = firstName.trim();
  }

  if (lastName !== undefined) {
    if (typeof lastName !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Last name must be a string'
      });
    }
    updateData.lastName = lastName.trim();
  }

  if (profilePicture !== undefined) {
    if (typeof profilePicture !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Profile picture must be a string (URL)'
      });
    }
    updateData.profilePicture = profilePicture.trim();
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { 
      new: true, 
      runValidators: true,
      select: '-__v'
    }
  );

  if (!updatedUser) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        profilePicture: updatedUser.profilePicture,
        role: updatedUser.role,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    }
  });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.role) {
    query.role = req.query.role;
  }

  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  // Get users with pagination
  const users = await User.find(query)
    .select('-__v')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId).select('-__v');

  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Role must be either "user" or "admin"'
    });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true, select: '-__v' }
  );

  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (req.user._id.toString() === userId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'You cannot delete your own account'
    });
  }

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};
