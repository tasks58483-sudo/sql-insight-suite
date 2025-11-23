import { createGenericStore } from './generic-store';
import { Department } from '@/types/schema';

const useDepartmentStoreBase = createGenericStore<Department>('departments');

const departmentSelector = (state: any) => ({
  departments: state.items,
  loading: state.loading,
  error: state.error,
  fetchDepartments: state.fetchItems,
  createDepartment: state.createItem,
  updateDepartment: state.updateItem,
  deleteDepartment: state.deleteItem,
});

export const useDepartmentStore = () => useDepartmentStoreBase(departmentSelector);
