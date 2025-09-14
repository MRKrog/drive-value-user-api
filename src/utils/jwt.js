const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'drive-value-api',
    audience: 'drive-value-frontend'
  });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'drive-value-api',
      audience: 'drive-value-frontend'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode a JWT token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null if invalid
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded ? new Date(decoded.exp * 1000) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  return expiration ? expiration < new Date() : true;
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired
};
