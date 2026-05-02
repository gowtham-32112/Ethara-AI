import { create } from 'zustand';
import api from '../services/api/client';

const useTaskStore = create((set, get) => ({
  tasks: [],
  dashboard: null,
  loading: false,

  fetchTasks: async (projectId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/projects/${projectId}/tasks`);
      set({ tasks: data, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  createTask: async (projectId, taskData) => {
    const { data } = await api.post(`/projects/${projectId}/tasks`, taskData);
    set((state) => ({ tasks: [...state.tasks, data] }));
    return data;
  },

  updateTask: async (taskId, taskData) => {
    const { data } = await api.put(`/tasks/${taskId}`, taskData);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? data : t)),
    }));
    return data;
  },

  deleteTask: async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  fetchDashboard: async (projectId) => {
    try {
      const { data } = await api.get(`/projects/${projectId}/dashboard`);
      set({ dashboard: data });
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Group tasks by status for Kanban
  getTasksByStatus: () => {
    const tasks = get().tasks;
    return {
      TODO: tasks.filter((t) => t.status === 'TODO'),
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
      DONE: tasks.filter((t) => t.status === 'DONE'),
    };
  },
}));

export default useTaskStore;
