import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      matchmaker: null,
      isAuthenticated: false,
      login:  (matchmaker) => set({ matchmaker, isAuthenticated: true }),
      logout: ()           => set({ matchmaker: null, isAuthenticated: false }),
    }),
    {
      name: 'tdc-auth-v1',
      partialize: (s) => ({ matchmaker: s.matchmaker, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useAuthStore;
