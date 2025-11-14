import { create } from 'zustand';
import { QueryLog } from '@/types/schema';
import { queryLogger } from '@/lib/query-logger';

interface SqlStore {
  logs: QueryLog[];
  isPanelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  clearLogs: () => void;
  addLog: (log: QueryLog) => void;
}

export const useSqlStore = create<SqlStore>((set) => {
  // Subscribe to query logger
  queryLogger.subscribe((log) => {
    set((state) => ({ logs: [log, ...state.logs] }));
  });

  return {
    logs: queryLogger.getLogs(),
    isPanelOpen: false,
    setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),
    clearLogs: () => {
      queryLogger.clearLogs();
      set({ logs: [] });
    },
    addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
  };
});
