import { createGenericStore } from './generic-store';
import { Enrollment } from '@/types/schema';

const useEnrollmentStoreBase = createGenericStore<Enrollment>('enrollments');

const enrollmentSelector = (state: any) => ({
  enrollments: state.items,
  loading: state.loading,
  error: state.error,
  fetchEnrollments: state.fetchItems,
  createEnrollment: state.createItem,
  updateEnrollment: state.updateItem,
  deleteEnrollment: state.deleteItem,
});

export const useEnrollmentStore = () => useEnrollmentStoreBase(enrollmentSelector);
