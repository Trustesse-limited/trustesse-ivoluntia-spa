import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthCookie, removeAuthCookie, setUserRoleCookie, removeUserRoleCookie } from '@/app/actions/cookies';

export type UserRole = 'volunteer' | 'organization' | 'admin' | 'super_admin';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  getUserRole: () => UserRole | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token });
        // Also set cookie for server-side auth
        if (token) {
          setAuthCookie(token);
        } else {
          removeAuthCookie();
        }
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        // Set cookies for server-side auth
        setAuthCookie(token);
        if (user.role) {
          setUserRoleCookie(user.role);
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Remove cookies
        removeAuthCookie();
        removeUserRoleCookie();
      },
      
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
