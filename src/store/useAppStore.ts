import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/src/types';

interface AppState {
  user: User | null;
  profile: UserProfile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  isSidebarOpen: true,
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  theme: (localStorage.getItem('vite-ui-theme') as 'light' | 'dark') || 'light',
  setTheme: (theme) => {
    localStorage.setItem('vite-ui-theme', theme);
    set({ theme });
  },
}));
