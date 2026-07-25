'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuthStore, UserRole } from '@/store';

interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  token: string | null;
  isLoading: boolean;
  userRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        // Get user role from store
        const role = (user as { role?: UserRole })?.role || null;
        setUserRole(role);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user]);

  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    userRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
