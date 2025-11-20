# Middleware Setup Guide

## Overview
This directory contains all middleware functions for the Hypertrophic API. Each middleware serves a specific purpose in the request/response cycle.

## Middleware Files

### 1. `auth.ts` - Authentication Middleware
**Purpose**: Verifies JWT tokens and adds user context to requests.

**Features**:
- Extracts JWT token from Authorization header
- Verifies token using JWT_SECRET
- Adds decoded user data to `req.user`
- Proper error handling with asyncHandler

**Usage**:
```typescript
import verifyToken from '../middleware/auth';

// Apply to routes
app.use('/api/protected', verifyToken, protectedRoutes);
```

### 2. `errorHandler.ts` - Error Handling Middleware
**Purpose**: Centralized error handling and logging.

**Features**:
- Logs errors with stack traces
- Returns appropriate HTTP status codes
- Hides stack traces in production
- Provides async error wrapper

**Usage**:
```typescript
import { errorHandler, asyncHandler } from '../middleware/errorHandler';

// Apply globally (must be last)
app.use(errorHandler);

// Wrap async functions
const asyncFunction = asyncHandler(async (req, res, next) => {
  // Your async code here
});
```

### 3. `rateLimiter.ts` - Rate Limiting Middleware
**Purpose**: Prevents API abuse by limiting requests per IP.

**Features**:
- In-memory request counting
- Configurable limits and time windows
- Returns retry-after headers
- Per-IP tracking

**Usage**:
```typescript
import rateLimiter from '../middleware/rateLimiter';

// 100 requests per 15 minutes
app.use(rateLimiter(100, 15 * 60 * 1000));
```

### 4. `validation.ts` - Request Validation Middleware
**Purpose**: Validates request body data before processing.

**Features**:
- Type checking (string, number, boolean, email)
- Length validation
- Pattern matching
- Required field validation
- Detailed error messages

**Usage**:
```typescript
import { validateRequest, userValidationRules } from '../middleware/validation';

// Apply to routes
router.post('/users', validateRequest(userValidationRules), createUser);
```

## Middleware Order
The middleware should be applied in this order:

1. **CORS** - Handle cross-origin requests
2. **Body Parsers** - Parse request bodies
3. **Logging** - Log requests
4. **Rate Limiting** - Prevent abuse
5. **Authentication** - Verify tokens (for protected routes)
6. **Validation** - Validate request data
7. **Route Handlers** - Process requests
8. **Error Handler** - Handle errors (must be last)

## Environment Variables Required

```bash
# Required for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Optional for CORS
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=your-database-connection-string
```

## Testing Middleware

### Test Authentication
```bash
# This should fail (no token)
curl http://localhost:8080/api/users

# This should work (with valid token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/api/users
```

### Test Rate Limiting
```bash
# Make many requests quickly to see rate limiting in action
for i in {1..110}; do curl http://localhost:8080/health; done
```

### Test Validation
```bash
# This should fail validation
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'

# This should pass validation
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'
```

## Best Practices

1. **Always use asyncHandler** for async middleware functions
2. **Apply error handler last** in the middleware chain
3. **Use TypeScript interfaces** for type safety
4. **Log important events** for debugging
5. **Validate all inputs** before processing
6. **Rate limit public endpoints** to prevent abuse
7. **Use environment variables** for configuration
8. **Return consistent error responses** across all middleware

## Security Considerations

- JWT tokens should have expiration times
- Rate limiting prevents brute force attacks
- Input validation prevents injection attacks
- CORS should be configured for your frontend domain
- Error messages should not expose sensitive information
- Use HTTPS in production 