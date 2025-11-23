import { createGenericStore } from './generic-store';
import { Faculty } from '@/types/schema';

const useFacultyStoreBase = createGenericStore<Faculty>('faculty');

const facultySelector = (state: any) => ({
  faculty: state.items,
  loading: state.loading,
  error: state.error,
  fetchFaculty: state.fetchItems,
  createFaculty: state.createItem,
  updateFaculty: state.updateItem,
  deleteFaculty: state.deleteItem,
});

export const useFacultyStore = () => useFacultyStoreBase(facultySelector);
