import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuth: (user, token) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isInitialized: true,
        });
      },
      setAccessToken: (token) => {
        set({
          accessToken: token,
          isAuthenticated: !!token,
        });
      },
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },
      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },
    }),
    {
      name: 'hirium_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);
