# Network Debugging Guide for Expo Go

## ✅ **Connection Status: WORKING**

Your backend is accessible at `http://10.0.0.74:8080/api` ✅

## 🔧 **Quick Fixes**

### 1. **Restart Your App**
```bash
# Stop Expo
Ctrl+C

# Clear cache and restart
npx expo start --clear
```

### 2. **Check Network Settings**
- Ensure your phone and computer are on the same WiFi network
- Try turning WiFi off/on on your phone
- Try switching between WiFi networks

### 3. **Test with Different URLs**
If `10.0.0.74` doesn't work, try these alternatives:

```typescript
// In frontend/app/config/api.ts
export const API_CONFIG = {
  // Try these one by one:
  BASE_URL: 'http://10.0.0.74:8080/api',     // Your current IP
  // BASE_URL: 'http://192.168.1.100:8080/api', // Alternative IP format
  // BASE_URL: 'http://localhost:8080/api',      // For simulator only
};
```

## 🐛 **Debugging Steps**

### Step 1: Check Console Logs
1. Open Expo DevTools in your browser
2. Go to the "Console" tab
3. Try to login/signup
4. Look for these logs:
   ```
   Attempting login to: http://10.0.0.74:8080/api/auth/login
   Login payload: { email: '...', password: '***' }
   ```

### Step 2: Test Network Requests
1. In Expo DevTools, go to "Network" tab
2. Try to login/signup
3. Look for failed requests (red entries)
4. Check the request URL and response

### Step 3: Verify Backend Logs
```bash
cd backend
npm start
# Watch for incoming requests when you try to login
```

## 📱 **Device-Specific Issues**

### iPhone/iOS
- iOS sometimes blocks non-HTTPS connections
- Try adding your IP to trusted networks
- Check if you have any VPN active

### Android
- Android is generally more permissive
- Check if you have any firewall apps
- Try disabling mobile data temporarily

### Expo Go App
- Try closing and reopening Expo Go
- Clear Expo Go cache: Settings → Clear Cache
- Try scanning the QR code again

## 🔍 **Advanced Debugging**

### Test API Manually
```bash
# Test from your computer
curl -X POST http://10.0.0.74:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Check Firewall
```bash
# On macOS, check if port 8080 is blocked
sudo lsof -i :8080
```

### Test Different Ports
If port 8080 is blocked, try changing the backend port:
```typescript
// In backend/index.ts
const PORT = process.env.PORT || 3001; // Change to 3001

// In frontend/app/config/api.ts
BASE_URL: 'http://10.0.0.74:3001/api',
```

## 🚨 **Common Error Messages**

| **Error** | **Solution** |
|-----------|-------------|
| "Network Error" | Check if backend is running |
| "Connection Refused" | Verify IP address and port |
| "Timeout" | Check network speed/stability |
| "CORS Error" | Backend CORS is already fixed |

## 📋 **Checklist**

- [ ] Backend running on port 8080
- [ ] Using correct IP: `10.0.0.74`
- [ ] Phone and computer on same WiFi
- [ ] No firewall blocking port 8080
- [ ] Expo Go app restarted
- [ ] Console logs showing API calls
- [ ] Network tab showing requests

## 🆘 **Emergency Solutions**

### Option 1: Use Localhost (Simulator Only)
```typescript
// Only for iOS Simulator or Android Emulator
BASE_URL: 'http://localhost:8080/api',
```

### Option 2: Use ngrok (Temporary)
```bash
# Install ngrok
npm install -g ngrok

# Expose your backend
ngrok http 8080

# Use the ngrok URL in your config
BASE_URL: 'https://abc123.ngrok.io/api',
```

### Option 3: Disable CORS (Testing Only)
```typescript
// In backend/index.ts (REMOVE AFTER TESTING)
app.use(cors()); // Allow all origins
```

## 📞 **Still Having Issues?**

1. **Check the console logs** - they now show detailed information
2. **Try the test script**: `node test-connection.js`
3. **Verify your IP hasn't changed**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
4. **Restart everything**: Backend, Expo, and your phone

The connection is working from your computer, so the issue is likely device-specific or network-related. 