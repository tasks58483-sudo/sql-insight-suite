import { create } from 'zustand';
import { Department } from '@/types/schema';
import { useSqlStore } from './sql-store';

const API_URL = 'http://127.0.0.1:5000/api';

interface DepartmentStore {
  departments: Department[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: Omit<Department, 'id'>) => Promise<void>;
  updateDepartment: (id: number, data: Partial<Omit<Department, 'id'>>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
}

export const useDepartmentStore = create<DepartmentStore>((set) => ({
  departments: [],
  loading: false,
  error: null,

  fetchDepartments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/departments`);
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      const result = await response.json();
      set({ departments: result.data, loading: false });
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  createDepartment: async (data) => {
    try {
      const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create department');
      }
      const result = await response.json();
      set((state) => ({
        departments: [result.data, ...state.departments],
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update department');
      }
      const result = await response.json();
      set((state) => ({
        departments: state.departments.map((d) =>
          d.id === id ? { ...d, ...result.data } : d
        ),
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  deleteDepartment: async (id) => {
    try {
      const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete department');
      }
       const result = await response.json();
      set((state) => ({
        departments: state.departments.filter((d) => d.id !== id),
      }));
       useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },
}));
