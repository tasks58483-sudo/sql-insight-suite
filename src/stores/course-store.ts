import { create } from 'zustand';
import { Course } from '@/types/schema';
import { useSqlStore } from './sql-store';

const API_URL = 'http://127.0.0.1:5000/api';

interface CourseStore {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (data: Course) => Promise<void>;
  updateCourse: (code: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (code: string) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set) => ({
  courses: [],
  loading: false,
  error: null,

  fetchCourses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const result = await response.json();
      set({ courses: result.data, loading: false });
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage, loading: false });
    }
  },

  createCourse: async (data) => {
    try {
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to create course');
      }
      const result = await response.json();
      set((state) => ({
        courses: [result.data, ...state.courses],
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  updateCourse: async (code, data) => {
    try {
      const response = await fetch(`${API_URL}/courses/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update course');
      }
      const result = await response.json();
      set((state) => ({
        courses: state.courses.map((c) =>
          c.code === code ? { ...c, ...result.data } : c
        ),
      }));
      useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },

  deleteCourse: async (code) => {
    try {
      const response = await fetch(`${API_URL}/courses/${code}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
       const result = await response.json();
      set((state) => ({
        courses: state.courses.filter((c) => c.code !== code),
      }));
       useSqlStore.getState().addLogs(result.query_logs);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      set({ error: errorMessage });
    }
  },
}));
