const User = require('../models/User');
const { verifyGoogleToken } = require('../utils/googleAuth');
const { generateToken } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Authenticate user with Google OAuth
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Google token is required'
    });
  }

  try {
    // Verify Google token
    const googleProfile = await verifyGoogleToken(token);

    // Find or create user
    const user = await User.findOrCreate(googleProfile);

    // Generate JWT token
    const jwtToken = generateToken(user);

    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
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
        },
        token: jwtToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    
    if (error.message.includes('Google token verification failed')) {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid Google token'
      });
    }
    
    throw error; // Let error handler catch it
  }
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
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
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  // We could implement a token blacklist here if needed for enhanced security
  
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @desc    Refresh user token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate new token
  const newToken = generateToken(user);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  });
});

/**
 * @desc    Verify token validity
 * @route   GET /api/auth/verify
 * @access  Private
 */
const verifyToken = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: 'Token is valid',
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

module.exports = {
  googleAuth,
  getMe,
  logout,
  refreshToken,
  verifyToken
};
