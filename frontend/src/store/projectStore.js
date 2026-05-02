import { create } from 'zustand';
import api from '../services/api/client';

const useProjectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/projects');
      set({ projects: data, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchProject: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/projects/${id}`);
      set({ currentProject: data, loading: false });
      return data;
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  createProject: async (projectData) => {
    const { data } = await api.post('/projects', projectData);
    set((state) => ({ projects: [data, ...state.projects] }));
    return data;
  },

  updateProject: async (id, projectData) => {
    const { data } = await api.put(`/projects/${id}`, projectData);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
      currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...data } : state.currentProject,
    }));
    return data;
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  addMember: async (projectId, email, role) => {
    const { data } = await api.post(`/projects/${projectId}/members`, { email, role });
    // Refresh project to get updated members
    await get().fetchProject(projectId);
    return data;
  },

  removeMember: async (projectId, userId) => {
    await api.delete(`/projects/${projectId}/members/${userId}`);
    await get().fetchProject(projectId);
  },
}));

export default useProjectStore;
