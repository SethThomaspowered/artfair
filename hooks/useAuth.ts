import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User, AuthState } from '@/types/auth';
import { Platform } from 'react-native';

// Mock users for demonstration purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Art Enthusiast',
  },
  {
    id: '2',
    email: 'collector@example.com',
    password: 'password123',
    name: 'Art Collector',
  },
];

// Use localStorage for web and SecureStore for native
const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeData = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await getData('user');
        if (userData) {
          const user: User = JSON.parse(userData);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkLoginStatus();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        // In a real app, this would be an API call to your backend
        const mockUser = MOCK_USERS.find(
          (user) => user.email === email && user.password === password
        );

        if (mockUser) {
          const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
          };

          await storeData('user', JSON.stringify(user));

          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } else {
          return { success: false, error: 'Invalid email or password' };
        }
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'An error occurred during login' };
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        // Check if email already exists
        const userExists = MOCK_USERS.some((user) => user.email === email);
        
        if (userExists) {
          return { success: false, error: 'Email already in use' };
        }

        // In a real app, this would be an API call to create a new user
        const newUser: User = {
          id: String(Date.now()),
          email,
          name,
        };

        await storeData('user', JSON.stringify(newUser));

        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'An error occurred during registration' };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await removeData('user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
  };
};