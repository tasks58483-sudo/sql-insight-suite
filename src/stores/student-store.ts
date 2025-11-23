import { create } from 'zustand';
import { Student } from '@/types/schema';
import { useSqlStore } from './sql-store';

const API_URL = 'http://127.0.0.1:5000/api';

interface StudentStore {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudent: (id: number) => Promise<Student | null>;
  createStudent: (data: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: number, data: Partial<Omit<Student, 'id'>>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const result = await response.json();
      set({ students: result.data, loading: false });
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchStudent: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/students/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student');
      }
      const result = await response.json();
      set({ loading: false });
      useSqlStore.getState().addLogs(result.query_logs);
      return result.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  createStudent: async (data) => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create student');
      }
      const result = await response.json();
      set((state) => ({
        students: [result.data, ...state.students],
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  updateStudent: async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      const result = await response.json();
      set((state) => ({
        students: state.students.map((s) =>
          s.id === id ? { ...s, ...result.data } : s
        ),
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
       const result = await response.json();
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
      }));
       useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },
}));
