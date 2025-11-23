import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface QueryLog {
  id: string;
  sql: string;
  params: any[];
  duration: number;
  timestamp: Date;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN';
}

interface SqlStore {
  logs: QueryLog[];
  isPanelOpen: boolean;
  setPanelOpen: (isOpen: boolean) => void;
  addLog: (log: Omit<QueryLog, 'id' | 'timestamp'>) => void;
  addLogs: (logs: Omit<QueryLog, 'id' | 'timestamp' | 'operation'>[]) => void;
  clearLogs: () => void;
}

const getOperation = (sql: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UNKNOWN' => {
  const operation = sql.trim().substring(0, 6).toUpperCase();
  if (['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(operation)) {
    return operation as 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  }
  return 'UNKNOWN';
};

export const useSqlStore = create<SqlStore>((set) => ({
  logs: [],
  isPanelOpen: false,
  setPanelOpen: (isOpen) => set({ isPanelOpen: isOpen }),
  addLog: (log) =>
    set((state) => ({
      logs: [
        { ...log, id: uuidv4(), timestamp: new Date() },
        ...state.logs,
      ],
    })),
  addLogs: (logs) =>
    set((state) => ({
      logs: [
        ...logs.map((log) => ({
          ...log,
          id: uuidv4(),
          timestamp: new Date(),
          operation: getOperation(log.sql),
        })),
        ...state.logs,
      ],
    })),
  clearLogs: () => set({ logs: [] }),
}));
