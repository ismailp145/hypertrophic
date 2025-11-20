# Authentication Setup

This document explains the JWT-based authentication system implemented in the Hypertrophic app.

## Overview

The authentication system uses:
- **JWT tokens** for secure authentication
- **expo-secure-store** for secure token storage
- **React Context** for global auth state management
- **Axios interceptors** for automatic token inclusion in API requests

## File Structure

```
app/
├── context/
│   └── AuthContext.tsx          # Main auth context and provider
├── config/
│   └── api.ts                   # API configuration
├── (auth)/
│   ├── Home.tsx                 # Landing page
│   ├── Login.tsx                # Login screen
│   ├── Signup.tsx               # Signup screen
│   └── _layout.tsx              # Auth layout
├── (tabs)/
│   ├── index.tsx                # Main home screen
│   ├── workouts.tsx             # Workouts screen
│   ├── profile.tsx              # Profile screen
│   └── _layout.tsx              # Tabs layout
└── _layout.tsx                  # Root layout with auth guard
```

## Key Features

### 1. AuthContext
- Manages user authentication state
- Provides login, signup, and logout functions
- Automatically handles token storage and retrieval
- Sets up axios interceptors for API requests

### 2. Secure Token Storage
- Uses `expo-secure-store` for encrypted token storage
- Tokens are automatically included in API requests
- Invalid tokens are automatically cleared

### 3. Navigation Guard
- Automatically redirects users based on auth status
- Unauthenticated users are redirected to auth screens
- Authenticated users are redirected to main app

### 4. API Integration
- Automatic token inclusion in requests
- Automatic logout on 401 responses
- Centralized API configuration

## Usage

### Using the Auth Context

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // User is now logged in
    } else {
      // Handle error
    }
  };
}
```

### API Configuration

Update the backend URL in `app/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api', // Development
  // BASE_URL: 'https://your-backend.com/api', // Production
};
```

## Backend Requirements

The backend must provide these endpoints:

### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### POST /api/auth/register
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### GET /api/auth/profile
Headers: `Authorization: Bearer jwt_token_here`

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

## Development Setup

1. **Install dependencies:**
   ```bash
   npm install expo-secure-store
   ```

2. **Update API URL:**
   - Edit `app/config/api.ts`
   - Use your computer's IP address if testing on physical device

3. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

4. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

## Security Features

- **Secure token storage** using expo-secure-store
- **Automatic token refresh** on app startup
- **Automatic logout** on invalid tokens
- **Protected routes** with navigation guards
- **Error handling** for network issues

## Troubleshooting

### Network Issues
- Ensure backend is running on the correct port
- Update API_BASE_URL in `app/config/api.ts`
- Use your computer's IP address for physical device testing

### Token Issues
- Check that JWT_SECRET is set in backend environment
- Verify token expiration settings
- Check network connectivity

### Navigation Issues
- Ensure all route files exist in the correct locations
- Check that route names match exactly
- Verify that _layout.tsx files are properly configured 