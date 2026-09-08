/**
 * Client-side Authentication State Management
 * 
 * SECURITY ARCHITECTURE: Pure Server-Side Authentication
 * 
 * This store manages client-side authentication state (UI state only).
 * Actual authentication tokens are stored securely in HTTP-only cookies
 * and are managed server-side. The store only tracks:
 * - User information (for UI display)
 * - Authentication status (for UI logic)
 * - Loading states
 * 
 * SECURITY NOTE: No tokens are stored in this store or localStorage.
 * All token management happens server-side via HTTP-only cookies.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthCookie, removeAuthCookie, setUserRoleCookie, removeUserRoleCookie } from '@/app/actions/cookies';
import { clearRememberMe } from '@/lib/rememberMe';

export type UserRole = 'volunteer' | 'organization' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  accountType?: 'Volunteer' | 'Organization' | 'Admin';
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null; // In-memory only, NOT persisted to localStorage
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void; // Only for server cookie management
  setLoading: (loading: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  getUserRole: () => UserRole | null;
  checkAuth: () => boolean; // Check if user is authenticated
  validateToken: () => Promise<boolean>; // Validate token with server and set isAuthenticated
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
        // Set cookie for server-side auth (HTTP-only, secure)
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
        // Use accountType for user_role cookie, not role (role is from JWT like "FoundationAdmin")
        if (user.accountType) {
          setUserRoleCookie(user.accountType.toLowerCase());
        }
      },
      
      logout: () => {
        // Clear all persisted storage first to prevent re-hydration
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Remove cookies (server-side token management)
        removeAuthCookie();
        removeUserRoleCookie();
        
        // SECURITY: Clear remembered credentials on logout
        clearRememberMe();
        
        // Clear all persisted storage from localStorage again to ensure it's gone
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },
      
      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      checkAuth: () => {
        const { user, isAuthenticated } = get();
        // User is authenticated if isAuthenticated is true and user exists
        return isAuthenticated && !!user;
      },

      validateToken: async () => {
        // Fallback: assume authenticated if user data exists
        const { user } = get();
        if (user && user.id && user.email) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
      version: 6, // Increment version to force migration and fix accountType inference
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // SECURITY: Token is NOT persisted to localStorage
        // Only stored in HTTP-only cookies server-side
      }),
      migrate: (persistedState: unknown, version: number) => {
        // If version is less than 5, clear the state to force fresh start
        // This ensures any previously stored tokens are removed
        if (version < 5) {
          return {
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,
          };
        }
        // Remove token from persisted state if it exists
        const state = persistedState as { token?: string };
        if (state.token) {
          delete state.token;
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        // After rehydration, set isAuthenticated based on user data
        if (state) {
          // Assume authenticated if user data exists
          state.isAuthenticated = !!state.user && !!state.user.id && !!state.user.email;
          // Ensure token is not persisted
          state.token = null;
          // Ensure accountType is set from user object
          if (state.user && !state.user.accountType) {
            // If accountType is missing, try to infer from role
            if (state.user.role) {
              const roleToAccountType: Record<string, 'Volunteer' | 'Organization' | 'Admin'> = {
                'volunteer': 'Volunteer',
                'organization': 'Organization',
                'admin': 'Admin',
                'super_admin': 'Admin',
                'FoundationAdmin': 'Organization',
                'VolunteerAdmin': 'Volunteer',
              };
              state.user.accountType = roleToAccountType[state.user.role] || 'Volunteer';
            }
          }
        }
      },
    }
  )
);
