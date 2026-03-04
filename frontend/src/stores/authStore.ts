import { create } from 'zustand';
import api from '../api/axios';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => void;
  updateUser: (user: User) => void;
}

interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/v1/login', {
        user: { email, password },
      });
      const token = response.headers['authorization']?.replace('Bearer ', '');
      const user = response.data.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, loading: false });
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  signup: async (data: SignupData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/v1/signup', { user: data });
      const token = response.headers['authorization']?.replace('Bearer ', '');
      const user = response.data.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, loading: false });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.status?.errors?.join(', ') || 'Signup failed';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      await api.delete('/api/v1/logout');
    } catch {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },

  updateUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
