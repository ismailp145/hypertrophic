# Copilot Instructions for Hypertrophic Project

## Project Overview
This is a full-stack fitness application with a React Native/Expo frontend and Node.js/Express backend. The project uses JWT authentication, PostgreSQL database with Drizzle ORM, and includes workout tracking functionality.

## Critical Issue: JWT Storage in Expo Go

### Problem Description
The JWT token is not being properly saved in `expo-secure-store` when running in Expo Go, causing authentication failures.

### Root Cause
`expo-secure-store` has limitations in Expo Go development builds. It may not persist data reliably between app restarts or may fail silently.

### Solutions to Implement

#### 1. Immediate Fix - Add Fallback Storage
```typescript
// In AuthContext.tsx, modify the storeToken function:
const storeToken = async (token: string) => {
  try {
    // Try SecureStore first
    await SecureStore.setItemAsync('auth_token', token);
    setToken(token);
  } catch (error) {
    console.warn('SecureStore failed, using AsyncStorage fallback:', error);
    // Fallback to AsyncStorage for development
    try {
      await AsyncStorage.setItem('auth_token', token);
      setToken(token);
    } catch (fallbackError) {
      console.error('Both storage methods failed:', fallbackError);
    }
  }
};
```

#### 2. Development vs Production Storage Strategy
```typescript
const getStorageMethod = () => {
  if (__DEV__) {
    // In development, prefer AsyncStorage for reliability
    return 'asyncStorage';
  }
  // In production builds, use SecureStore
  return 'secureStore';
};
```

#### 3. Add AsyncStorage Dependency
```bash
npx expo install @react-native-async-storage/async-storage
```

#### 4. Enhanced Token Validation
```typescript
const checkAuthStatus = async () => {
  try {
    let storedToken = await getStoredToken();
    
    if (!storedToken) {
      // Try fallback storage
      storedToken = await AsyncStorage.getItem('auth_token');
    }
    
    if (storedToken) {
      setToken(storedToken);
      
      // Verify token with backend
      const response = await axios.get(ENDPOINTS.AUTH.PROFILE);
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        await removeStoredToken();
      }
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    await removeStoredToken();
  } finally {
    setIsLoading(false);
  }
};
```

## Project Architecture

### Frontend Structure
- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context for authentication
- **HTTP Client**: Axios with interceptors
- **Storage**: expo-secure-store (with AsyncStorage fallback)

### Backend Structure
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Zod schemas
- **Logging**: Winston

## Development Guidelines

### 1. Authentication Flow
- JWT tokens are sent in Authorization header as `Bearer {token}`
- Tokens are validated on protected routes
- Automatic logout on 401 responses
- Token refresh mechanism should be implemented

### 2. API Configuration
- Development: Use local IP address for device testing
- Production: Use environment variables for URLs
- CORS is configured for cross-origin requests
- Rate limiting is implemented

### 3. Database Operations
- Use Drizzle ORM for all database queries
- Run migrations with `npm run db:migrate`
- Use Drizzle Studio for database inspection: `npm run db:studio`

### 4. Error Handling
- Implement proper error boundaries in React components
- Use Winston for backend logging
- Return consistent error response format

## Testing Strategy

### Frontend Testing
- Test authentication flows in both Expo Go and development builds
- Verify token persistence across app restarts
- Test offline scenarios and network errors

### Backend Testing
- Test JWT token generation and validation
- Verify database operations with Drizzle
- Test rate limiting and CORS policies

## Deployment Considerations

### Frontend
- Build standalone APK/IPA for production testing
- Use EAS Build for production builds
- Configure environment-specific API endpoints

### Backend
- Use environment variables for sensitive data
- Implement proper CORS for production domains
- Set up monitoring and logging

## Common Issues and Solutions

### 1. JWT Not Persisting
- **Cause**: Expo Go storage limitations
- **Solution**: Implement fallback storage and test in development builds

### 2. Network Errors on Device
- **Cause**: Incorrect IP address configuration
- **Solution**: Use `ifconfig` to get correct local IP and update `api.ts`

### 3. CORS Issues
- **Cause**: Backend CORS configuration mismatch
- **Solution**: Ensure CORS allows your frontend origin

### 4. Database Connection
- **Cause**: Environment variables not set
- **Solution**: Check `.env` file and database configuration

## Code Quality Standards

### TypeScript
- Use strict mode
- Define proper interfaces for all data structures
- Avoid `any` types

### React Native
- Use functional components with hooks
- Implement proper error boundaries
- Follow React Native best practices for performance

### Backend
- Use async/await consistently
- Implement proper input validation with Zod
- Use Winston for structured logging

## Security Considerations

### JWT Security
- Implement token expiration
- Use secure random secrets
- Validate tokens on all protected routes

### Data Protection
- Hash passwords with bcrypt
- Use HTTPS in production
- Implement rate limiting

### Storage Security
- Use expo-secure-store for sensitive data in production
- Implement proper token cleanup on logout
- Validate stored data integrity

## Performance Optimization

### Frontend
- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize image loading with expo-image

### Backend
- Implement database connection pooling
- Use proper indexing for database queries
- Implement caching where appropriate

## Monitoring and Debugging

### Frontend Debugging
- Use React Native Debugger
- Implement comprehensive logging
- Test on multiple devices and OS versions

### Backend Monitoring
- Use Winston for structured logging
- Implement health check endpoints
- Monitor database performance

## Next Steps

1. **Immediate**: Fix JWT storage issue with fallback implementation
2. **Short-term**: Implement token refresh mechanism
3. **Medium-term**: Add comprehensive error handling and user feedback
4. **Long-term**: Implement offline support and data synchronization

## Resources

- [Expo SecureStore Documentation](https://docs.expo.dev/versions/latest/sdk/securestore/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/) 