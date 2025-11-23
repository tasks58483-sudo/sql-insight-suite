import { createGenericStore } from './generic-store';
import { Student } from '@/types/schema';

const useStudentStoreBase = createGenericStore<Student>('students');

const studentSelector = (state: any) => ({
  students: state.items,
  loading: state.loading,
  error: state.error,
  fetchStudents: state.fetchItems,
  createStudent: state.createItem,
  updateStudent: state.updateItem,
  deleteStudent: state.deleteItem,
});

export const useStudentStore = () => useStudentStoreBase(studentSelector);
