# Token Storage Verification Guide

This guide will help you verify that the JWT authentication token is being stored correctly in your Hypertrophic app.

## What We've Implemented

### 1. **Dual Storage Strategy**
- **Primary**: `expo-secure-store` for secure token storage
- **Fallback**: `@react-native-async-storage/async-storage` for development reliability
- **Automatic fallback**: If SecureStore fails, AsyncStorage is used automatically

### 2. **Enhanced Logging**
- Comprehensive console logging for all storage operations
- Token retrieval status logging
- Error handling with detailed messages

### 3. **Debug Tools**
- `TokenDebugger` component for testing storage
- `TokenStorageTester` component for comprehensive testing
- `debugTokenStatus()` function for console debugging

## How to Verify Token Storage

### Step 1: Check Console Logs

When you log in, you should see these logs:

```
Storing token in SecureStore...
Token stored successfully in SecureStore
Token also stored in AsyncStorage as backup
```

When making API calls, you should see:

```
Retrieving token from SecureStore...
Token found in SecureStore
Authorization header set successfully
```

### Step 2: Use the Token Storage Tester

1. **Add the tester to your app temporarily:**

```tsx
// In any screen, add this import:
import { TokenStorageTester } from '../components/TokenStorageTester';

// Then add this component to your JSX:
<TokenStorageTester />
```

2. **Test the storage:**
   - Press "Run All Tests" button to test both storage methods
   - Press "Check Current Storage" to see if auth tokens are present
   - Check the results for storage status
   - Verify token presence in both storage methods

### Step 3: Use the Token Debugger

1. **Add the debugger to your app temporarily:**

```tsx
// In any screen, add this import:
import { TokenDebugger } from '../components/TokenDebugger';

// Then add this component to your JSX:
<TokenDebugger />
```

2. **Test the storage:**
   - Press "Test Token Storage" button
   - Check the logs for storage status
   - Verify token presence in both storage methods

### Step 4: Manual Console Testing

Open your browser console or React Native debugger and run:

```javascript
// Test token storage status
await debugTokenStatus();

// Check current auth state
console.log('Current token:', token);
console.log('Current user:', user);
```

## Expected Behavior

### ✅ **Successful Token Storage**
- Token is stored in both SecureStore and AsyncStorage
- Token is retrieved successfully for API calls
- Authorization header is set correctly
- API requests include `Bearer <token>` header

### ❌ **Common Issues & Solutions**

#### Issue: "No auth token found for request"
**Cause**: Token not stored or retrieval failed
**Solution**: 
1. Check if login was successful
2. Verify token storage logs
3. Check both storage methods

#### Issue: "SecureStore failed, using AsyncStorage fallback"
**Cause**: SecureStore not available (common in Expo Go)
**Solution**: This is normal in development - AsyncStorage will work

#### Issue: "All storage methods failed"
**Cause**: Both storage methods unavailable
**Solution**: 
1. Check if AsyncStorage is installed
2. Verify app permissions
3. Test in development build vs Expo Go

## Testing Checklist

- [ ] Login process completes successfully
- [ ] Console shows "Token stored successfully" messages
- [ ] TokenStorageTester shows both storage methods working
- [ ] Token is present in both storage methods
- [ ] API calls include Authorization header
- [ ] Protected routes work without 401 errors
- [ ] Token persists after app restart

## Debugging Commands

### Check Token in SecureStore
```javascript
import * as SecureStore from 'expo-secure-store';
const token = await SecureStore.getItemAsync('auth_token');
console.log('SecureStore token:', token ? 'Present' : 'Missing');
```

### Check Token in AsyncStorage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
const token = await AsyncStorage.getItem('auth_token');
console.log('AsyncStorage token:', token ? 'Present' : 'Missing');
```

### Test API Call with Token
```javascript
// This should work if token is stored correctly
const response = await fetch('http://10.0.0.74:8080/api/workouts/sessions', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
console.log('API Response:', response.status);
```

## Storage Method Priority

1. **SecureStore** (most secure, preferred)
2. **AsyncStorage** (fallback for development)
3. **In-memory state** (last resort)

## Environment-Specific Behavior

### Expo Go (Development)
- SecureStore may be unreliable
- AsyncStorage fallback is essential
- Token persistence may be limited

### Development Build
- Both storage methods should work
- Better token persistence
- More reliable storage

### Production Build
- SecureStore is fully supported
- Maximum security and reliability
- Token persistence across app restarts

## Troubleshooting Steps

1. **Check installation**: Ensure AsyncStorage is installed
2. **Verify login**: Confirm login response includes token
3. **Check storage logs**: Look for storage success/failure messages
4. **Test fallback**: Verify AsyncStorage works if SecureStore fails
5. **Check API calls**: Ensure Authorization header is set
6. **Verify backend**: Confirm backend accepts Bearer tokens

## Next Steps

If token storage is working correctly:
1. Remove the TokenDebugger and TokenStorageTester components
2. Test your workout functionality
3. Verify API calls work with authentication

If issues persist:
1. Check the console logs for specific error messages
2. Test in a development build vs Expo Go
3. Verify your backend JWT configuration
4. Check network connectivity and CORS settings

## Support

If you continue to have issues:
1. Share the console logs from login and API calls
2. Test with the debug tools provided
3. Check if the issue is Expo Go specific
4. Verify backend JWT token generation and validation
