import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { AuthContextType, User } from '../types/auth.types';
import { storage } from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => storage.getToken());
  const [user, setUser] = useState<User | null>(() => storage.getUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = storage.getToken();

      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setAccessToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setAccessToken(storedToken);
          storage.setUser(currentUser);
        }
      } catch {
        // Token is invalid, expired, or backend rejected it
        if (isMounted) {
          storage.clearSession();
          setUser(null);
          setAccessToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for global 401 unauthorized events dispatched by axios interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (mobile: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ mobile, password });
      storage.setToken(response.accessToken);
      storage.setUser(response.user);
      setAccessToken(response.accessToken);
      setUser(response.user);
      return response.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Backend logout failed or offline; clearing local session', e);
    } finally {
      storage.clearSession();
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  const refreshCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      storage.setUser(currentUser);
      return currentUser;
    } catch {
      storage.clearSession();
      setUser(null);
      setAccessToken(null);
      return null;
    }
  }, []);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    login,
    logout,
    refreshCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
