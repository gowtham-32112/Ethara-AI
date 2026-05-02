import { create } from 'zustand';
import api from '../services/api/client';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: true,

  // Initialize auth state from stored token
  init: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, token, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },

  register: async (name, email, password, requestAdmin) => {
    const { data } = await api.post('/auth/register', { name, email, password, requestAdmin });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  isAuthenticated: () => !!get().token && !!get().user,
}));

export default useAuthStore;
