import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Enrollment } from '@/types/schema';
import { queryLogger } from '@/lib/query-logger';

interface EnrollmentStore {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  fetchEnrollments: () => Promise<void>;
  createEnrollment: (data: Omit<Enrollment, 'id' | 'enrolledAt'>) => Promise<void>;
  updateEnrollment: (id: number, data: Partial<Enrollment>) => Promise<void>;
  deleteEnrollment: (id: number) => Promise<void>;
}

const mockEnrollments: Enrollment[] = [
  { id: 1, studentId: 1, courseCode: 'CS101', grade: 'A', enrolledAt: new Date('2023-01-15') },
  { id: 2, studentId: 1, courseCode: 'CS201', enrolledAt: new Date('2023-08-20') },
  { id: 3, studentId: 2, courseCode: 'MATH101', grade: 'B+', enrolledAt: new Date('2023-01-15') },
  { id: 4, studentId: 3, courseCode: 'CS101', grade: 'A-', enrolledAt: new Date('2022-01-10') },
];

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set, get) => ({
      enrollments: mockEnrollments,
      loading: false,
      error: null,

      fetchEnrollments: async () => {
        set({ loading: true, error: null });
        
        queryLogger.addLog(
          'SELECT',
          'SELECT * FROM enrollments ORDER BY enrolled_at DESC',
          []
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        set({ loading: false });
      },

      createEnrollment: async (data) => {
        const newId = Math.max(0, ...get().enrollments.map(e => e.id)) + 1;
        const newEnrollment = { 
          ...data, 
          id: newId,
          enrolledAt: new Date()
        };
        
        queryLogger.addLog(
          'INSERT',
          'INSERT INTO enrollments (student_id, course_code, grade, enrolled_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
          [data.studentId, data.courseCode, data.grade]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          enrollments: [...state.enrollments, newEnrollment],
        }));
      },

      updateEnrollment: async (id, data) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        
        queryLogger.addLog(
          'UPDATE',
          `UPDATE enrollments SET ${setClause} WHERE id = $${fields.length + 1}`,
          [...values, id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          enrollments: state.enrollments.map(e =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },

      deleteEnrollment: async (id) => {
        queryLogger.addLog(
          'DELETE',
          'DELETE FROM enrollments WHERE id = $1',
          [id]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          enrollments: state.enrollments.filter(e => e.id !== id),
        }));
      },
    }),
    {
      name: 'enrollment-storage',
    }
  )
);