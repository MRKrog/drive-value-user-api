# Drive Value User API Documentation

A comprehensive Node.js + Express API for user authentication and management with Google OAuth integration.

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
   Copy `.env` file and update with your values:
   ```bash
   cp .env .env.local
   ```

3. **Configure Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your frontend URL to authorized origins

4. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
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

**Request Body:**
```json
{
  "token": "google-oauth-token"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://...",
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

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://...",
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/logout
Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST /api/auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new-jwt-token",
    "expiresIn": "7d"
  }
}
```

#### GET /api/auth/verify
Verify token validity.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    }
  }
}
```

### User Management Endpoints

#### GET /api/users/profile
Get user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://...",
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /api/users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "firstName": "John",
  "lastName": "Smith",
  "profilePicture": "https://new-profile-picture.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Smith",
      "firstName": "John",
      "lastName": "Smith",
      "profilePicture": "https://new-profile-picture.com/image.jpg",
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Admin Endpoints

#### GET /api/users
Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### GET /api/users/:id
Get user by ID (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://...",
      "role": "user",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /api/users/:id/role
Update user role (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  }
}
```

#### DELETE /api/users/:id
Delete user (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## 🗄️ Database Schema

### User Model
```javascript
{
  googleId: String (required, unique),
  email: String (required, unique),
  name: String (required),
  firstName: String,
  lastName: String,
  profilePicture: String,
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
- **Rate Limiting**: Built-in protection (can be added)

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Email is required",
      "value": ""
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "error": "Access denied",
  "message": "No token provided"
}
```

#### 403 Forbidden
```json
{
  "error": "Access denied",
  "message": "Insufficient permissions"
}
```

#### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong processing your request"
}
```

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
server.js                     # Server entry point
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

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the repository or contact the development team.
