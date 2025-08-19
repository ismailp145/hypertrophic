import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
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
      console.log('Storing token in SecureStore...');
      await SecureStore.setItemAsync('auth_token', token);
      console.log('Token stored successfully in SecureStore');
      setToken(token);
      
      // Also store in AsyncStorage as backup for development
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem('auth_token', token);
        console.log('Token also stored in AsyncStorage as backup');
      } catch (fallbackError) {
        console.log('AsyncStorage backup not available:', fallbackError);
      }
    } catch (error) {
      console.error('Error storing token in SecureStore:', error);
      
      // Fallback to AsyncStorage if SecureStore fails
      try {
        console.log('Trying AsyncStorage fallback...');
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.setItem('auth_token', token);
        console.log('Token stored successfully in AsyncStorage fallback');
        setToken(token);
      } catch (fallbackError) {
        console.error('Both storage methods failed:', fallbackError);
        // Still set the token in state even if storage fails
        setToken(token);
      }
    }
  };

  const getStoredToken = async (): Promise<string | null> => {
    try {
      console.log('Retrieving token from SecureStore...');
      let token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        console.log('Token found in SecureStore');
        return token;
      }
      
      // Try AsyncStorage as fallback
      console.log('No token in SecureStore, trying AsyncStorage...');
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      token = await AsyncStorage.default.getItem('auth_token');
      
      if (token) {
        console.log('Token found in AsyncStorage fallback');
        // Migrate to SecureStore if possible
        try {
          await SecureStore.setItemAsync('auth_token', token);
          console.log('Token migrated to SecureStore');
        } catch (migrationError) {
          console.log('Could not migrate token to SecureStore:', migrationError);
        }
        return token;
      }
      
      console.log('No token found in any storage');
      return null;
    } catch (error) {
      console.error('Error getting stored token:', error);
      
      // Try AsyncStorage as last resort
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const token = await AsyncStorage.default.getItem('auth_token');
        if (token) {
          console.log('Token retrieved from AsyncStorage after error');
          return token;
        }
      } catch (fallbackError) {
        console.error('All storage methods failed:', fallbackError);
      }
      
      return null;
    }
  };

  const removeStoredToken = async () => {
    try {
      console.log('Removing token from SecureStore...');
      await SecureStore.deleteItemAsync('auth_token');
      console.log('Token removed from SecureStore');
      
      // Also remove from AsyncStorage
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.removeItem('auth_token');
        console.log('Token removed from AsyncStorage');
      } catch (fallbackError) {
        console.log('AsyncStorage removal failed:', fallbackError);
      }
      
      setToken(null);
    } catch (error) {
      console.error('Error removing token from SecureStore:', error);
      
      // Try AsyncStorage removal as fallback
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.removeItem('auth_token');
        console.log('Token removed from AsyncStorage fallback');
      } catch (fallbackError) {
        console.error('Both storage removal methods failed:', fallbackError);
      }
      
      setToken(null);
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log('Checking authentication status...');
      const storedToken = await getStoredToken();
      
      if (storedToken) {
        console.log('Found stored token, setting in state...');
        setToken(storedToken);
        
        // Verify token by calling profile endpoint
        try {
          const response = await axios.get(ENDPOINTS.AUTH.PROFILE, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.data.success) {
            console.log('Token verified successfully, setting user data');
            setUser(response.data.user);
          } else {
            console.log('Token verification failed, removing token');
            await removeStoredToken();
          }
        } catch (apiError) {
          console.error('API call failed during auth check:', apiError);
          await removeStoredToken();
        }
      } else {
        console.log('No stored token found');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
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