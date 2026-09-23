import { User } from '../types/auth.types';

const TOKEN_KEY = 'daddy_soda_token';
const USER_KEY = 'daddy_soda_user';

export const storage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Failed to save auth token to localStorage', e);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error('Failed to remove auth token from localStorage', e);
    }
  },

  getUser: (): User | null => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user info to localStorage', e);
    }
  },

  removeUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to remove user info from localStorage', e);
    }
  },

  clearSession: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear session from localStorage', e);
    }
  },
};
