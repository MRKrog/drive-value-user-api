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
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        subscription: user.subscription,
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
  const { profile, preferences } = req.body;

  // Validate and prepare update data
  const updateData = {};
  
  // Update profile data
  if (profile) {
    if (profile.name && (typeof profile.name !== 'string' || profile.name.trim().length === 0)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name must be a non-empty string'
      });
    }
    
    if (profile.firstName && typeof profile.firstName !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'First name must be a string'
      });
    }
    
    if (profile.lastName && typeof profile.lastName !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Last name must be a string'
      });
    }
    
    if (profile.avatar && typeof profile.avatar !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Avatar must be a string (URL)'
      });
    }
    
    if (profile.city && typeof profile.city !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'City must be a string'
      });
    }
    
    if (profile.state && typeof profile.state !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'State must be a string'
      });
    }
    
    updateData.profile = profile;
  }

  // Update preferences data
  if (preferences) {
    if (preferences.theme && !['light', 'dark', 'auto'].includes(preferences.theme)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Theme must be one of: light, dark, auto'
      });
    }
    
    if (preferences.currency && !['USD', 'EUR', 'GBP', 'CAD'].includes(preferences.currency)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Currency must be one of: USD, EUR, GBP, CAD'
      });
    }
    
    if (preferences.units && !['imperial', 'metric'].includes(preferences.units)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Units must be one of: imperial, metric'
      });
    }
    
    updateData.preferences = preferences;
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
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
        profile: updatedUser.profile,
        preferences: updatedUser.preferences,
        stats: updatedUser.stats,
        subscription: updatedUser.subscription,
        role: updatedUser.role,
        lastLogin: updatedUser.lastLogin,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    }
  });
});

/**
 * @desc    Update user stats (e.g., increment search count)
 * @route   PUT /api/users/stats
 * @access  Private
 */
const updateUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { totalSearches } = req.body;

  const updateData = {};
  
  if (totalSearches !== undefined) {
    if (typeof totalSearches !== 'number' || totalSearches < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Total searches must be a non-negative number'
      });
    }
    updateData['stats.totalSearches'] = totalSearches;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
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
    message: 'Stats updated successfully',
    data: {
      stats: updatedUser.stats
    }
  });
});

/**
 * @desc    Update user subscription
 * @route   PUT /api/users/subscription
 * @access  Private
 */
const updateUserSubscription = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { plan, status, price, nextBilling, trialEnds } = req.body;

  const updateData = {};
  
  if (plan && !['free', 'premium', 'enterprise'].includes(plan)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Plan must be one of: free, premium, enterprise'
    });
  }
  
  if (status && !['active', 'inactive', 'cancelled', 'trial'].includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Status must be one of: active, inactive, cancelled, trial'
    });
  }
  
  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Price must be a non-negative number'
      });
    }
    updateData['subscription.price'] = price;
  }
  
  if (plan) updateData['subscription.plan'] = plan;
  if (status) updateData['subscription.status'] = status;
  if (nextBilling) updateData['subscription.nextBilling'] = new Date(nextBilling);
  if (trialEnds) updateData['subscription.trialEnds'] = new Date(trialEnds);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
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
    message: 'Subscription updated successfully',
    data: {
      subscription: updatedUser.subscription
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
      { 'profile.name': { $regex: req.query.search, $options: 'i' } },
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
        profile: user.profile,
        preferences: user.preferences,
        stats: user.stats,
        subscription: user.subscription,
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
        profile: user.profile,
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
  updateUserStats,
  updateUserSubscription,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser
};