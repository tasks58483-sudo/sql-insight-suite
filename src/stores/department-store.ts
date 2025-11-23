import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Department } from '@/types/schema';
import { queryLogger } from '@/lib/query-logger';

interface DepartmentStore {
  departments: Department[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  createDepartment: (data: Omit<Department, 'id'>) => Promise<void>;
  updateDepartment: (id: number, data: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
}

const mockDepartments: Department[] = [
  { id: 1, name: 'Computer Science', head: 'Dr. Alan Turing' },
  { id: 2, name: 'Mathematics', head: 'Dr. Ada Lovelace' },
  { id: 3, name: 'Physics', head: 'Dr. Marie Curie' },
  { id: 4, name: 'Chemistry', head: 'Dr. Dmitri Mendeleev' },
];

export const useDepartmentStore = create<DepartmentStore>()(
  persist(
    (set, get) => ({
      departments: mockDepartments,
      loading: false,
      error: null,

      fetchDepartments: async () => {
        set({ loading: true, error: null });
        
        queryLogger.addLog(
          'SELECT',
          'SELECT * FROM departments ORDER BY name ASC',
          []
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        set({ loading: false });
      },

      createDepartment: async (data) => {
        const newId = Math.max(0, ...get().departments.map(d => d.id)) + 1;
        const newDepartment = { ...data, id: newId };
        
        queryLogger.addLog(
          'INSERT',
          'INSERT INTO departments (name, head) VALUES ($1, $2) RETURNING *',
          [data.name, data.head]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          departments: [...state.departments, newDepartment],
        }));
      },

      updateDepartment: async (id, data) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        
        queryLogger.addLog(
          'UPDATE',
          `UPDATE departments SET ${setClause} WHERE id = $${fields.length + 1}`,
          [...values, id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          departments: state.departments.map(d =>
            d.id === id ? { ...d, ...data } : d
          ),
        }));
      },

      deleteDepartment: async (id) => {
        queryLogger.addLog(
          'DELETE',
          'DELETE FROM departments WHERE id = $1',
          [id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          departments: state.departments.filter(d => d.id !== id),
        }));
      },
    }),
    {
      name: 'department-storage',
    }
  )
);