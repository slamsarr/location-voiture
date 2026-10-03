import { useState, useEffect } from 'react';
import { UserSession } from '../types';
import { api } from '../services/api';

const USER_KEY = 'hertz_digital_user_v1';
const TOKEN_KEY = 'hertz_digital_token_v1';

export function getStoredUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(getStoredUser());
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
      setToken(localStorage.getItem(TOKEN_KEY));
    };
    window.addEventListener('auth_changed', handleAuthChange);
    return () => window.removeEventListener('auth_changed', handleAuthChange);
  }, []);

  const loginDemo = async (role: 'ADMIN' | 'CLIENT') => {
    setIsLoading(true);
    try {
      const data = await api.demoLogin(role);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      window.dispatchEvent(new Event('auth_changed'));
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginManual = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const data = await api.login(credentials);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      setToken(data.token);
      window.dispatchEvent(new Event('auth_changed'));
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event('auth_changed'));
  };

  const setUserSession = (newUser: UserSession | null) => {
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setUser(newUser);
    window.dispatchEvent(new Event('auth_changed'));
  };

  return {
    user,
    setUser: setUserSession,
    token,
    isAdmin: user?.role === 'ADMIN',
    isAuthenticated: !!user,
    isLoading,
    loginDemo,
    loginManual,
    logout,
  };
}

export const useAuthStore = useAuth;
