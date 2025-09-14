const jwt = require('../utils/jwt');
const User = require('../models/User');

/**
 * Middleware to authenticate JWT tokens
 * Attaches user to req.user if token is valid
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    // Verify the token
    const decoded = jwt.verifyToken(token);
    
    // Find the user in the database
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please sign in again'
      });
    } else if (error.message.includes('Invalid token')) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please sign in again'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid token'
      });
    }
  }
};

/**
 * Middleware to check if user has required role
 * @param {string|Array} roles - Required role(s)
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user to req.user if token is valid, but doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next(); // No token, continue without user
    }

    const decoded = jwt.verifyToken(token);
    const user = await User.findById(decoded.userId).select('-__v');
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // If token is invalid, continue without user
    console.warn('Optional auth failed:', error.message);
    next();
  }
};

/**
 * Middleware to check if user is the owner of the resource or admin
 * @param {string} userIdParam - Name of the parameter containing user ID
 */
const requireOwnershipOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    const resourceUserId = req.params[userIdParam];
    const isOwner = req.user._id.toString() === resourceUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only access your own resources'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  optionalAuth,
  requireOwnershipOrAdmin
};
