import { QueryLog } from '@/types/schema';

class QueryLogger {
  private logs: QueryLog[] = [];
  private subscribers: Set<(log: QueryLog) => void> = new Set();

  addLog(operation: QueryLog['operation'], sql: string, params: any[] = []) {
    const startTime = performance.now();
    const duration = Math.random() * 10 + 1; // Simulate query time
    
    const logEntry: QueryLog = {
      id: Math.random().toString(36).substr(2, 9),
      sql,
      params,
      duration: Math.round(duration * 100) / 100,
      timestamp: new Date(),
      operation,
    };
    
    this.logs.unshift(logEntry);
    if (this.logs.length > 100) this.logs.pop(); // Keep only last 100
    
    this.subscribers.forEach(cb => cb(logEntry));
  }

  subscribe(callback: (log: QueryLog) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const queryLogger = new QueryLogger();
