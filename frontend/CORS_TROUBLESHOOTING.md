# CORS Troubleshooting Guide

## Common CORS Issues and Solutions

### 1. **Network Access Issues**

#### Problem: Can't connect from physical device
**Solution:** Use your computer's IP address instead of localhost

```typescript
// In frontend/app/config/api.ts
export const API_CONFIG = {
  // For device testing, use your computer's IP:
  BASE_URL: 'http://10.0.0.74:8080/api', // Replace with your IP
};
```

**To find your IP address:**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig | findstr "IPv4"
```

### 2. **Backend CORS Configuration**

The backend is now configured to accept requests from:
- `http://localhost:3000` (Web development)
- `http://localhost:8081` (Expo web)
- `http://localhost:19006` (Expo dev server)
- `exp://localhost:19000` (Expo Go)
- `exp://10.0.0.74:19000` (Expo Go with IP)
- `http://10.0.0.74:8081` (Expo web with IP)

### 3. **Testing Steps**

#### Step 1: Test Backend
```bash
cd backend
npm start
# Should see: "Server running on http://localhost:8080"
```

#### Step 2: Test CORS from browser
Open browser and go to: `http://localhost:8080/health`
Should return: `{"status":"healthy","timestamp":"..."}`

#### Step 3: Test from React Native
1. Start Expo: `npm start`
2. Open Expo Go on your device
3. Scan the QR code
4. Try to login/signup

### 4. **Common Error Messages**

#### "Network Error"
- Check if backend is running
- Verify IP address is correct
- Ensure device and computer are on same network

#### "CORS Error"
- Backend CORS not configured for your origin
- Check if your Expo URL is in the allowed origins

#### "Connection Refused"
- Backend not running
- Wrong port number
- Firewall blocking connection

### 5. **Environment-Specific Configurations**

#### Development (Computer only)
```typescript
BASE_URL: 'http://localhost:8080/api'
```

#### Device Testing (Same network)
```typescript
BASE_URL: 'http://10.0.0.74:8080/api' // Your computer's IP
```

#### Production
```typescript
BASE_URL: 'https://your-backend-domain.com/api'
```

### 6. **Debugging Tools**

#### Check Network Requests
1. Open Expo DevTools
2. Go to Network tab
3. Look for failed requests

#### Backend Logs
```bash
cd backend
npm start
# Watch for incoming requests in console
```

#### React Native Debugger
1. Install React Native Debugger
2. Enable remote debugging in Expo
3. Check Network tab for failed requests

### 7. **Quick Fixes**

#### If using Expo Go:
1. Make sure device and computer are on same WiFi
2. Use computer's IP address, not localhost
3. Check that backend is running on port 8080

#### If using Expo Web:
1. Use `http://localhost:8081` in browser
2. Backend should accept `http://localhost:8081` origin

#### If using physical device:
1. Find your computer's IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update `frontend/app/config/api.ts` with your IP
3. Restart both frontend and backend

### 8. **Advanced CORS Configuration**

If you need to add more origins, edit `backend/index.ts`:

```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'exp://localhost:19000',
    'exp://10.0.0.74:19000', // Your IP
    // Add more origins as needed
  ].filter((url): url is string => Boolean(url)),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};
```

### 9. **Testing Checklist**

- [ ] Backend is running on port 8080
- [ ] Frontend API URL is correct for your environment
- [ ] Device and computer are on same network
- [ ] Backend CORS includes your Expo URL
- [ ] No firewall blocking port 8080
- [ ] Network requests are reaching the backend (check logs)

### 10. **Emergency Fallback**

If nothing works, temporarily disable CORS for testing:

```typescript
// In backend/index.ts (REMOVE AFTER TESTING)
app.use(cors()); // Allow all origins
```

**⚠️ Warning:** Only use this for testing, never in production! 