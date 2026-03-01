'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getCurrentUser, logout as authLogout } from './auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    // Check authentication on mount - only once
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    setMounted(true);

    // Check session periodically (every 5 minutes)
    const interval = setInterval(() => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: user !== null,
    isAdmin: user?.role === 'admin',
    login,
    logout,
    refreshUser,
  };

  // Don't render children until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
