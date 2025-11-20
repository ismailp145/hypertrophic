# JWT Token Guide

## How to Get JWT Tokens

You have several ways to get JWT tokens for testing your API:

### 1. **Quick Test Token** (Recommended for testing)
Generate a test token instantly:

```bash
npm run token
```

This will output a test JWT token that you can use immediately.

### 2. **Register a New User** (Production method)
Create a new user account and get a token:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. **Login with Existing User** (Production method)
Login with existing credentials:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Using Your JWT Token

Once you have a token, use it in the Authorization header:

```bash
# Replace YOUR_TOKEN_HERE with the actual token
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:8080/api/users

# Example with the test token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." http://localhost:8080/api/workouts
```

## API Endpoints

### Public Endpoints (No token needed):
- `GET /` - Health check
- `GET /health` - Health status
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Endpoints (Token required):
- `GET /api/auth/profile` - Get user profile
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout by ID
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

## Environment Setup

Make sure you have these environment variables set in your `.env` file:

```bash
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-database-connection-string
FRONTEND_URL=http://localhost:3000
```

## Testing Examples

### 1. Get a test token:
```bash
npm run token
```

### 2. Test protected endpoint:
```bash
# This will fail (no token)
curl http://localhost:8080/api/users

# This will work (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/users
```

### 3. Register a new user:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 4. Login with user:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

## Token Structure

The JWT token contains:
```json
{
  "userId": 1,
  "email": "test@example.com",
  "name": "Test User",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Security Notes

- Tokens expire after 24 hours
- Store tokens securely in your frontend
- Never expose JWT_SECRET in client-side code
- Use HTTPS in production
- Consider implementing token refresh for better UX

## Troubleshooting

### Token expired:
```json
{
  "success": false,
  "message": "Invalid token."
}
```

### No token provided:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Invalid token:
```json
{
  "success": false,
  "message": "Invalid token."
}
``` 