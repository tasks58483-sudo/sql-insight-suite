import { create } from 'zustand';
import { Enrollment } from '@/types/schema';
import { useSqlStore } from './sql-store';

const API_URL = 'http://127.0.0.1:5000/api';

interface EnrollmentStore {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  fetchEnrollments: () => Promise<void>;
  createEnrollment: (data: Omit<Enrollment, 'id'>) => Promise<void>;
  updateEnrollment: (id: number, data: Partial<Omit<Enrollment, 'id'>>) => Promise<void>;
  deleteEnrollment: (id: number) => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentStore>((set) => ({
  enrollments: [],
  loading: false,
  error: null,

  fetchEnrollments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/enrollments`);
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      const result = await response.json();
      set({ enrollments: result.data, loading: false });
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  createEnrollment: async (data) => {
    try {
      const response = await fetch(`${API_URL}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create enrollment');
      }
      const result = await response.json();
      set((state) => ({
        enrollments: [result.data, ...state.enrollments],
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  updateEnrollment: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/enrollments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update enrollment');
      }
      const result = await response.json();
      set((state) => ({
        enrollments: state.enrollments.map((e) =>
          e.id === id ? { ...e, ...result.data } : e
        ),
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  deleteEnrollment: async (id) => {
    try {
      const response = await fetch(`${API_URL}/enrollments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete enrollment');
      }
       const result = await response.json();
      set((state) => ({
        enrollments: state.enrollments.filter((e) => e.id !== id),
      }));
       useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },
}));
