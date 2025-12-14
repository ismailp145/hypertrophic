import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG, ENDPOINTS } from '../config/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Set up axios interceptor to include token in requests
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token is invalid, logout user
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

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

  const getStoredToken = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync('auth_token');
    } catch (error) {
      console.warn('SecureStore failed, trying AsyncStorage fallback:', error);
      try {
        return await AsyncStorage.getItem('auth_token');
      } catch (fallbackError) {
        console.error('Both storage methods failed:', fallbackError);
        return null;
      }
    }
  };

  const removeStoredToken = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
    } catch (error) {
      console.warn('SecureStore failed, using AsyncStorage fallback:', error);
      // Fallback to AsyncStorage for development
      try {
        await AsyncStorage.removeItem('auth_token');
        setToken(null);
      } catch (fallbackError) {
        console.error('Both storage methods failed:', fallbackError);
        // Still set token to null even if storage fails
        setToken(null);
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      let storedToken = await getStoredToken();
      
      if (!storedToken) {
        // Try fallback storage
        try {
          storedToken = await AsyncStorage.getItem('auth_token');
        } catch (fallbackError) {
          console.warn('AsyncStorage fallback also failed:', fallbackError);
        }
      }
      
      if (storedToken) {
        // Verify token by calling profile endpoint with explicit Authorization header
        // This avoids the race condition with the axios interceptor
        const response = await axios.get(ENDPOINTS.AUTH.PROFILE, {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        if (response.data.success) {
          setToken(storedToken);
          setUser(response.data.user);
        } else {
          // Token is invalid, remove it
          await removeStoredToken();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // If there's an error, remove the token
      await removeStoredToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Attempting login to:', `${axios.defaults.baseURL}${ENDPOINTS.AUTH.LOGIN}`);
      console.log('Login payload:', { email, password: '***' });
      
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        console.log('Login successful', newToken, userData);
        await storeToken(newToken);
        setUser(userData);
        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Attempting signup to:', `${axios.defaults.baseURL}${ENDPOINTS.AUTH.REGISTER}`);
      console.log('Signup payload:', { name, email, password: '***' });
      
      const response = await axios.post(ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password,
      });

      console.log('Signup response:', response.data);

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        await storeToken(newToken);
        setUser(userData);
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: response.data.message || 'Signup failed' };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await removeStoredToken();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 