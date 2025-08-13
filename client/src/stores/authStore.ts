import { create } from 'zustand';
import type { AuthState } from '../types/auth';
import { checkAuthStatus } from '../utils/auth';

interface AuthStore extends AuthState {
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  initAuth: async () => {
    const authState = await checkAuthStatus();
    set(authState);
  },
}));
