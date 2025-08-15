import { createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, isLoading, initAuth } = useAuthStore();

  useEffect(() => {
    // Only check auth status once when the component mounts
    const checkAuth = async () => {
      try {
        await initAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []); // Empty dependency array to run only once

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      useAuthStore.setState({ isAuthenticated: true, user: data.user, isLoading: false });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      useAuthStore.setState({ isAuthenticated: false, user: null, isLoading: false });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
