# Drive Value User API

A comprehensive Node.js + Express API for user authentication and management with Google OAuth integration. Built for the Drive Value AI platform with Redux-compatible user state management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- MongoDB running locally or MongoDB Atlas connection
- Google OAuth credentials

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env .env.local
   # Edit .env.local with your values
   ```

3. **Configure Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your frontend URL to authorized origins

4. **Start the server:**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📋 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 3001 | No |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/drivevalue | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | - | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d | No |
| `NODE_ENV` | Environment | development | No |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 | No |

## 🔐 Authentication Flow

### Google OAuth Flow
1. Frontend obtains Google OAuth token
2. Send token to `POST /api/auth/google`
3. Backend verifies token with Google
4. Find or create user in database
5. Generate JWT token
6. Return user data + JWT to frontend

### JWT Token Usage
Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication Endpoints

#### POST /api/auth/google
Authenticate user with Google OAuth token.

**Request:**
```json
{
  "token": "google-oauth-token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "name": "John Doe",
        "avatar": "https://...",
        "city": "New York",
        "state": "NY"
      },
      "preferences": {
        "theme": "dark",
        "currency": "USD",
        "units": "imperial"
      },
      "stats": {
        "totalSearches": 0
      },
      "subscription": {
        "plan": "free",
        "status": "active",
        "price": 0,
        "nextBilling": null,
        "trialEnds": null
      },
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token",
    "expiresIn": "7d"
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

#### POST /api/auth/logout
Logout user (client-side token removal).

#### POST /api/auth/refresh
Refresh JWT token.

#### GET /api/auth/verify
Verify token validity.

### User Management Endpoints

#### GET /api/users/profile
Get user profile with complete user data structure.

#### PUT /api/users/profile
Update user profile and preferences.

**Request:**
```json
{
  "profile": {
    "name": "John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "avatar": "https://new-profile-picture.com/image.jpg",
    "city": "San Francisco",
    "state": "CA"
  },
  "preferences": {
    "theme": "dark",
    "currency": "USD",
    "units": "imperial"
  }
}
```

#### PUT /api/users/stats
Update user statistics.

**Request:**
```json
{
  "totalSearches": 5
}
```

#### PUT /api/users/subscription
Update user subscription.

**Request:**
```json
{
  "plan": "premium",
  "status": "active",
  "price": 29.99,
  "nextBilling": "2024-02-01T00:00:00.000Z"
}
```

### Admin Endpoints

#### GET /api/users
Get all users (Admin only) with pagination and search.

#### GET /api/users/:id
Get user by ID (Admin only).

#### PUT /api/users/:id/role
Update user role (Admin only).

#### DELETE /api/users/:id
Delete user (Admin only).

## 🗄️ Database Schema

### User Model
```javascript
{
  // OAuth Authentication
  googleId: String (required, unique),
  email: String (required, unique),
  
  // Profile Information
  profile: {
    firstName: String,
    lastName: String,
    name: String (required),
    avatar: String,
    city: String,
    state: String
  },
  
  // User Preferences
  preferences: {
    theme: String (enum: ['light', 'dark', 'auto'], default: 'dark'),
    currency: String (enum: ['USD', 'EUR', 'GBP', 'CAD'], default: 'USD'),
    units: String (enum: ['imperial', 'metric'], default: 'imperial')
  },
  
  // User Statistics
  stats: {
    totalSearches: Number (default: 0)
  },
  
  // Subscription Information
  subscription: {
    plan: String (enum: ['free', 'premium', 'enterprise'], default: 'free'),
    status: String (enum: ['active', 'inactive', 'cancelled', 'trial'], default: 'active'),
    price: Number (default: 0),
    nextBilling: Date,
    trialEnds: Date
  },
  
  // System Fields
  authProvider: String (default: 'google'),
  role: String (default: 'user', enum: ['user', 'admin']),
  lastLogin: Date,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Google OAuth Verification**: Server-side token verification
- **CORS Protection**: Configurable CORS origins
- **Helmet Security**: Security headers
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error handling
- **Role-Based Access Control**: Admin and user permissions

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Test Authentication
```bash
# Test Google auth (replace with actual token)
curl -X POST http://localhost:3001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token": "your-google-token"}'
```

### Run Test Suite
```bash
node test-api.js
```

## 📁 Project Structure

```
src/
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── userController.js      # User management logic
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── errorHandler.js       # Global error handling
├── models/
│   └── User.js               # User Mongoose model
├── routes/
│   ├── auth.js               # Authentication routes
│   └── users.js              # User management routes
└── utils/
    ├── googleAuth.js         # Google OAuth utilities
    └── jwt.js                # JWT utilities
app.js                        # Main application setup
test-api.js                   # API testing script
API_DOCUMENTATION.md          # Complete API documentation
```

## 🚀 Features

### ✅ **Core Authentication**
- **Google OAuth Integration**: Seamless Google sign-in
- **JWT Token Management**: Secure session handling
- **User Registration/Login**: Automatic user creation
- **Session Management**: Token refresh and validation

### ✅ **User Management**
- **Profile Management**: Complete user profile system
- **Preferences**: Theme, currency, units settings
- **Statistics**: User activity tracking
- **Subscription Management**: Plan and billing management

### ✅ **Admin Features**
- **User Administration**: Full user management
- **Role Management**: Admin and user roles
- **User Search**: Search and filter users
- **Pagination**: Efficient data loading

### ✅ **Redux Compatibility**
- **Structured Data**: Matches Redux state structure
- **Nested Objects**: Profile, preferences, stats, subscription
- **Consistent API**: Predictable response format
- **Frontend Ready**: Direct integration with React/Redux

### ✅ **Production Ready**
- **Error Handling**: Comprehensive error management
- **Input Validation**: Request validation and sanitization
- **Security**: CORS, Helmet, JWT security
- **Documentation**: Complete API documentation
- **Testing**: Built-in test suite

## 🔧 Development

### Adding New User Fields
1. Update the User model in `src/models/User.js`
2. Update controllers to handle new fields
3. Update API documentation
4. Test with the test suite

### Adding New Endpoints
1. Create controller function in appropriate controller
2. Add route in `src/routes/`
3. Update API documentation
4. Add tests

### Environment Setup
```bash
# Development
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/drivevalue
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:5173

# Production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/drivevalue
# ... other production values
```

## 🚀 Deployment

### Environment Setup
1. Set production environment variables
2. Use MongoDB Atlas for production database
3. Configure proper CORS origins
4. Use strong JWT secrets
5. Enable HTTPS

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Monitoring & Analytics

The API includes built-in monitoring:
- Request logging with Morgan
- Error tracking and reporting
- Health check endpoint
- Performance monitoring ready

## 🔐 Security Considerations

1. **API Key Protection**: Never commit secrets to git
2. **JWT Security**: Use strong, unique JWT secrets
3. **CORS Configuration**: Restrict origins in production
4. **Input Validation**: All inputs are validated
5. **HTTPS Only**: Use SSL certificates in production
6. **Rate Limiting**: Can be added for production

## 📈 Scaling Considerations

- **Horizontal Scaling**: Stateless design allows multiple instances
- **Database**: MongoDB with proper indexing
- **Caching**: Can add Redis for session management
- **Load Balancer**: For high-traffic scenarios
- **CDN**: For static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 📝 License

ISC License

---

**Ready to power your Drive Value AI platform with secure user authentication! 🚀🔐**