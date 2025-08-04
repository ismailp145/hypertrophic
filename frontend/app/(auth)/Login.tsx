// app/LogIn.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        setSuccessMessage(result.message);
        // Navigate to main app after successful login
        setTimeout(() => {
          router.replace('/(tabs)/index' as any);
        }, 1000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error: any) {
      setErrorMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset link has been sent to your email');
    } catch (error: any) {
      let msg = 'Failed to send reset email. Please try again.';
      if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address';
      if (error.code === 'auth/user-not-found') msg = 'No account found with this email';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {errorMessage.length > 0 && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FF3B30" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {successMessage.length > 0 && (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#43B581" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.form}>
          {/* Email input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password link */}
          <TouchableOpacity onPress={handlePasswordReset}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Log In button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign up footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/Signup')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, // Changed from Discord Not Quite Black to White
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10 },
  backButton: { padding: 8 },
  content: { flex: 1, padding: 20, paddingTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000000', marginBottom: 8 }, // Changed from white to black
  subtitle: { fontSize: 16, color: '#666666', marginBottom: 40 }, // Changed from Discord Grey to darker grey
  form: { marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, color: '#000000', marginBottom: 8, fontWeight: '500' }, // Changed from white to black
  input: {
    backgroundColor: '#F5F5F5', // Changed from Discord Dark Not Black to light grey
    borderRadius: 8,
    padding: 16,
    color: '#000000', // Changed from white to black
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5', // Changed from Discord Dark Not Black to light grey
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordInput: { flex: 1, padding: 16, color: '#000000', fontSize: 16 }, // Changed from white to black
  eyeIcon: { padding: 10 },
  forgotPassword: {
    color: '#FF6B6B', // Changed to pastel red
    textAlign: 'right',
    marginTop: 10,
    marginBottom: 30,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FF6B6B', // Changed to pastel red
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: { color: '#666666', fontSize: 14 }, // Changed from Discord Grey to darker grey
  signUpText: { color: '#FF6B6B', fontWeight: '600', fontSize: 14 }, // Changed to pastel red
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ED4245',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    opacity: 0.9,
  },
  errorText: { color: '#FFF', marginLeft: 8, flex: 1, fontSize: 14 },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#43B581',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    opacity: 0.9,
  },
  successText: {
    color: '#FFF',
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});
