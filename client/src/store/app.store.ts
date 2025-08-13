import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isOnline: navigator.onLine,
      setOnline: (online) => set({ isOnline: online }),
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'app-store',
    }
  )
);
