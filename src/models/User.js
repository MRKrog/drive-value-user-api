// models/User.js - Updated Backend User Model (Simplified)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // OAuth Authentication
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Basic Profile (matches your Redux structure)
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    }
  },

  // User Preferences (matches your Redux)
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'CAD'],
      default: 'USD'
    },
    units: {
      type: String,
      enum: ['imperial', 'metric'],
      default: 'imperial'
    }
  },

  // User Stats (simplified)
  stats: {
    totalSearches: {
      type: Number,
      default: 0
    }
  },

  // Subscription Info (matches your Redux)
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'trial'],
      default: 'active'
    },
    price: {
      type: Number,
      default: 0
    },
    nextBilling: {
      type: Date,
      default: null
    },
    trialEnds: {
      type: Date,
      default: null
    }
  },

  // System fields
  authProvider: {
    type: String,
    default: 'google',
    enum: ['google']
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.googleId; // Don't expose this in API responses
      return ret;
    }
  }
});

// Indexes are defined in the schema fields above, no need for duplicate definitions

// Instance Methods
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

userSchema.methods.updateProfile = function(profileData) {
  Object.assign(this.profile, profileData);
  return this.save();
};

userSchema.methods.updatePreferences = function(preferencesData) {
  Object.assign(this.preferences, preferencesData);
  return this.save();
};

// Static Methods
userSchema.statics.findOrCreate = async function(googleProfile) {
  try {
    let user = await this.findOne({ googleId: googleProfile.sub });
    
    if (!user) {
      // Create new user with proper structure
      user = new this({
        googleId: googleProfile.sub,
        email: googleProfile.email,
        profile: {
          name: googleProfile.name,
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
          avatar: googleProfile.picture
        },
        lastLogin: new Date()
      });
      
      await user.save();
    } else {
      // Update existing user
      user.lastLogin = new Date();
      
      // Update profile if data has changed
      if (googleProfile.picture && user.profile.avatar !== googleProfile.picture) {
        user.profile.avatar = googleProfile.picture;
      }
      
      if (googleProfile.name && user.profile.name !== googleProfile.name) {
        user.profile.name = googleProfile.name;
        user.profile.firstName = googleProfile.given_name;
        user.profile.lastName = googleProfile.family_name;
      }
      
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
};

module.exports = mongoose.model('User', userSchema);