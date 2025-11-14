import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '@/types/schema';
import { queryLogger } from '@/lib/query-logger';

interface StudentStore {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudent: (id: number) => Promise<Student | null>;
  createStudent: (data: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: number, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

const mockStudents: Student[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '555-0101',
    departmentId: 1,
    enrollmentYear: 2022,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    phone: '555-0102',
    departmentId: 2,
    enrollmentYear: 2023,
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@university.edu',
    phone: '555-0103',
    departmentId: 1,
    enrollmentYear: 2021,
  },
];

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: mockStudents,
      loading: false,
      error: null,

      fetchStudents: async () => {
        set({ loading: true, error: null });
        
        // Log simulated SQL query
        queryLogger.addLog(
          'SELECT',
          'SELECT * FROM students ORDER BY id DESC',
          []
        );
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set({ loading: false });
      },

      fetchStudent: async (id: number) => {
        queryLogger.addLog(
          'SELECT',
          'SELECT * FROM students WHERE id = $1 LIMIT 1',
          [id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const student = get().students.find(s => s.id === id);
        return student || null;
      },

      createStudent: async (data) => {
        const newId = Math.max(0, ...get().students.map(s => s.id)) + 1;
        const newStudent = { ...data, id: newId };
        
        queryLogger.addLog(
          'INSERT',
          'INSERT INTO students (first_name, last_name, email, phone, department_id, enrollment_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [data.firstName, data.lastName, data.email, data.phone, data.departmentId, data.enrollmentYear]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          students: [...state.students, newStudent],
        }));
      },

      updateStudent: async (id, data) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        
        queryLogger.addLog(
          'UPDATE',
          `UPDATE students SET ${setClause} WHERE id = $${fields.length + 1}`,
          [...values, id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          students: state.students.map(s =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      deleteStudent: async (id) => {
        queryLogger.addLog(
          'DELETE',
          'DELETE FROM students WHERE id = $1',
          [id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          students: state.students.filter(s => s.id !== id),
        }));
      },
    }),
    {
      name: 'student-storage',
    }
  )
);
