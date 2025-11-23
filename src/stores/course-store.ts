import { createGenericStore } from './generic-store';
import { Course } from '@/types/schema';

const useCourseStoreBase = createGenericStore<Course>('courses');

const courseSelector = (state: any) => ({
  courses: state.items,
  loading: state.loading,
  error: state.error,
  fetchCourses: state.fetchItems,
  createCourse: state.createItem,
  updateCourse: state.updateItem,
  deleteCourse: state.deleteItem,
});

export const useCourseStore = () => useCourseStoreBase(courseSelector);
