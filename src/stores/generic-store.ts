import { create } from 'zustand';
import { useSqlStore } from './sql-store';

const API_URL = 'http://127.0.0.1:5000/api';

interface GenericState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  createItem: (data: Omit<T, 'id' | 'code'>) => Promise<void>;
  updateItem: (id: number | string, data: Partial<Omit<T, 'id' | 'code'>>) => Promise<void>;
  deleteItem: (id: number | string) => Promise<void>;
}

export const createGenericStore = <T extends { id?: number; code?: string }>(name: string) => {
  return create<GenericState<T>>((set) => ({
    items: [],
    loading: false,
    error: null,

    fetchItems: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/${name}`);
        if (!response.ok) throw new Error(`Failed to fetch ${name}`);
        const result = await response.json();
        set({ items: result.data, loading: false });
        useSqlStore.getState().addLogs(result.query_logs);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: errorMessage, loading: false });
      }
    },

    createItem: async (data) => {
      try {
        const response = await fetch(`${API_URL}/${name}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to create ${name}`);
        const result = await response.json();
        set((state) => ({ items: [result.data, ...state.items] }));
        useSqlStore.getState().addLogs(result.query_logs);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: errorMessage });
      }
    },

    updateItem: async (id, data) => {
      try {
        const response = await fetch(`${API_URL}/${name}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Failed to update ${name}`);
        const result = await response.json();
        set((state) => ({
          items: state.items.map((item) =>
            (item.id === id || item.code === id) ? { ...item, ...result.data } : item
          ),
        }));
        useSqlStore.getState().addLogs(result.query_logs);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: errorMessage });
      }
    },

    deleteItem: async (id) => {
      try {
        const response = await fetch(`${API_URL}/${name}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete ${name}`);
        const result = await response.json();
        set((state) => ({
          items: state.items.filter((item) => item.id !== id && item.code !== id),
        }));
        useSqlStore.getState().addLogs(result.query_logs);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        set({ error: errorMessage });
      }
    },
  }));
};
