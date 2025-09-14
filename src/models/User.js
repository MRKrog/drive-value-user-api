const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: null
  },
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
  timestamps: true, // This adds createdAt and updatedAt automatically
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find or create user from Google profile
userSchema.statics.findOrCreate = async function(googleProfile) {
  try {
    let user = await this.findOne({ googleId: googleProfile.sub });
    
    if (!user) {
      // Create new user
      user = new this({
        googleId: googleProfile.sub,
        email: googleProfile.email,
        name: googleProfile.name,
        firstName: googleProfile.given_name,
        lastName: googleProfile.family_name,
        profilePicture: googleProfile.picture,
        lastLogin: new Date()
      });
      
      await user.save();
    } else {
      // Update existing user's last login and potentially other fields
      user.lastLogin = new Date();
      
      // Update profile picture if it has changed
      if (googleProfile.picture && user.profilePicture !== googleProfile.picture) {
        user.profilePicture = googleProfile.picture;
      }
      
      // Update name if it has changed
      if (googleProfile.name && user.name !== googleProfile.name) {
        user.name = googleProfile.name;
        user.firstName = googleProfile.given_name;
        user.lastName = googleProfile.family_name;
      }
      
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
};

module.exports = mongoose.model('User', userSchema);
