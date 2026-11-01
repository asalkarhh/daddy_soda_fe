import { User } from '../types/auth.types';

const TOKEN_KEY = 'Daddy_soda_token';
const USER_KEY = 'Daddy_soda_user';

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

const READ_ENQUIRIES_KEY = 'daddy_soda_read_enquiry_ids';

export const enquiryStorage = {
  getReadIds: (): Set<string> => {
    try {
      const raw = localStorage.getItem(READ_ENQUIRIES_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  },

  markAsRead: (id: string): void => {
    try {
      if (!id) return;
      const raw = localStorage.getItem(READ_ENQUIRIES_KEY);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      if (!set.has(id)) {
        set.add(id);
        localStorage.setItem(READ_ENQUIRIES_KEY, JSON.stringify([...set]));
        window.dispatchEvent(new CustomEvent('daddy-soda:enquiry-read', { detail: { id } }));
      }
    } catch (e) {
      console.error('Failed to mark enquiry as read in localStorage', e);
    }
  },

  isRead: (id: string): boolean => {
    try {
      const raw = localStorage.getItem(READ_ENQUIRIES_KEY);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      return set.has(id);
    } catch {
      return false;
    }
  },
};
