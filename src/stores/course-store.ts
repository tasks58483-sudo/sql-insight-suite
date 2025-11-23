import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course } from '@/types/schema';
import { queryLogger } from '@/lib/query-logger';

interface CourseStore {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (data: Course) => Promise<void>;
  updateCourse: (code: string, data: Partial<Course>) => Promise<void>;
  deleteCourse: (code: string) => Promise<void>;
}

const mockCourses: Course[] = [
  { code: 'CS101', name: 'Introduction to Programming', credits: 3, departmentId: 1, description: 'Basic programming concepts' },
  { code: 'CS201', name: 'Data Structures', credits: 4, departmentId: 1, description: 'Advanced data structures and algorithms' },
  { code: 'MATH101', name: 'Calculus I', credits: 4, departmentId: 2, description: 'Differential calculus' },
  { code: 'PHYS101', name: 'Classical Mechanics', credits: 3, departmentId: 3, description: 'Newton\'s laws and mechanics' },
];

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: mockCourses,
      loading: false,
      error: null,

      fetchCourses: async () => {
        set({ loading: true, error: null });
        
        queryLogger.addLog(
          'SELECT',
          'SELECT * FROM courses ORDER BY code ASC',
          []
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        set({ loading: false });
      },

      createCourse: async (data) => {
        queryLogger.addLog(
          'INSERT',
          'INSERT INTO courses (code, name, credits, description, department_id, faculty_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [data.code, data.name, data.credits, data.description, data.departmentId, data.facultyId]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          courses: [...state.courses, data],
        }));
      },

      updateCourse: async (code, data) => {
        const fields = Object.keys(data);
        const values = Object.values(data);
        const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
        
        queryLogger.addLog(
          'UPDATE',
          `UPDATE courses SET ${setClause} WHERE code = $${fields.length + 1}`,
          [...values, code]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          courses: state.courses.map(c =>
            c.code === code ? { ...c, ...data } : c
          ),
        }));
      },

      deleteCourse: async (code) => {
        queryLogger.addLog(
          'DELETE',
          'DELETE FROM courses WHERE code = $1',
          [code]
        );
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        set((state) => ({
          courses: state.courses.filter(c => c.code !== code),
        }));
      },
    }),
    {
      name: 'course-storage',
    }
  )
);