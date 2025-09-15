const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required');
}

// Create OAuth2 client
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

/**
 * Verify Google OAuth token and return user profile
 * @param {string} token - Google OAuth token from frontend
 * @returns {Object} Google user profile
 */
const verifyGoogleToken = async (token) => {
  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    // Extract user information
    const userProfile = {
      sub: payload.sub, // Google user ID
      email: payload.email,
      name: payload.name,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
      email_verified: payload.email_verified,
      locale: payload.locale
    };

    // Validate required fields
    if (!userProfile.sub || !userProfile.email || !userProfile.email_verified) {
      throw new Error('Invalid Google profile: missing required fields');
    }

    return userProfile;
  } catch (error) {
    if (error.message.includes('Token used too early')) {
      throw new Error('Token used too early - please try again');
    } else if (error.message.includes('Token used too late')) {
      throw new Error('Token has expired - please sign in again');
    } else if (error.message.includes('Invalid token signature')) {
      throw new Error('Invalid token signature');
    } else {
      throw new Error(`Google token verification failed: ${error.message}`);
    }
  }
};

/**
 * Verify Google OAuth token with additional audience validation
 * @param {string} token - Google OAuth token from frontend
 * @param {string} expectedAudience - Expected audience (client ID)
 * @returns {Object} Google user profile
 */
const verifyGoogleTokenWithAudience = async (token, expectedAudience) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: expectedAudience
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    // Verify audience matches
    if (payload.aud !== expectedAudience) {
      throw new Error('Token audience mismatch');
    }

    const userProfile = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
      email_verified: payload.email_verified,
      locale: payload.locale
    };

    if (!userProfile.sub || !userProfile.email || !userProfile.email_verified) {
      throw new Error('Invalid Google profile: missing required fields');
    }

    return userProfile;
  } catch (error) {
    throw new Error(`Google token verification failed: ${error.message}`);
  }
};

/**
 * Get Google OAuth client for additional operations
 * @returns {OAuth2Client} Google OAuth2 client
 */
const getGoogleClient = () => {
  return client;
};

module.exports = {
  verifyGoogleToken,
  verifyGoogleTokenWithAudience,
  getGoogleClient
};
