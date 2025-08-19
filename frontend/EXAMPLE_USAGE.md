# Example Usage: Adding TokenStorageTester to Your Screens

This file shows you how to temporarily add the TokenStorageTester component to your existing screens to debug token storage issues.

## Example 1: Adding to Home Screen

```tsx
// frontend/app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
// Add this import temporarily:
import { TokenStorageTester } from '../../components/TokenStorageTester';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name}!</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your fitness journey starts here</Text>
        
        {/* Add this temporarily for debugging: */}
        <TokenStorageTester />
        
        {/* Your existing content */}
      </View>
    </SafeAreaView>
  );
}
```

## Example 2: Adding to Profile Screen

```tsx
// frontend/app/(tabs)/ProfilePage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
// Add this import temporarily:
import { TokenStorageTester } from '../../components/TokenStorageTester';

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>User Information</Text>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        
        {/* Add this temporarily for debugging: */}
        <TokenStorageTester />
      </View>
    </SafeAreaView>
  );
}
```

## Example 3: Adding to Workout Screen

```tsx
// frontend/app/(tabs)/WorkoutPage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Add this import temporarily:
import { TokenStorageTester } from '../../components/TokenStorageTester';

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Workout Sessions</Text>
        
        {/* Add this temporarily for debugging: */}
        <TokenStorageTester />
        
        {/* Your workout components */}
      </View>
    </SafeAreaView>
  );
}
```

## How to Use

1. **Add the import** at the top of your screen file
2. **Add the component** in your JSX where you want it to appear
3. **Test the functionality**:
   - Press "Run All Tests" to test both storage methods
   - Press "Check Current Storage" to see current auth tokens
   - Check the results for any issues
4. **Remove when done** - Delete the import and component when debugging is complete

## What to Look For

### ✅ **Good Results:**
- Both SecureStore and AsyncStorage tests pass
- "Check Current Storage" shows auth tokens are present
- No error messages in the results

### ❌ **Problem Results:**
- One or both storage methods fail
- "Check Current Storage" shows no auth tokens
- Error messages indicating storage issues

## After Testing

Once you've verified token storage is working:

1. **Remove the TokenStorageTester component** from your screens
2. **Remove the import statement**
3. **Test your actual app functionality** to ensure API calls work
4. **Check console logs** for any remaining issues

## Troubleshooting

If you see errors when adding the component:

1. **Check imports**: Ensure the path to TokenStorageTester is correct
2. **Verify dependencies**: Make sure AsyncStorage is installed
3. **Check TypeScript**: Ensure your project supports TypeScript
4. **Restart Metro**: Sometimes needed after adding new components

## Alternative: Use TokenDebugger

If you prefer a simpler debug component, you can use `TokenDebugger` instead:

```tsx
import { TokenDebugger } from '../../components/TokenDebugger';

// Then in your JSX:
<TokenDebugger />
```

The TokenDebugger is simpler but less comprehensive than TokenStorageTester.


