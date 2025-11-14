import { X } from 'lucide-react';
import { useSqlStore } from '@/stores/sql-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export const SqlDebuggerPanel = () => {
  const { logs, isPanelOpen, setPanelOpen, clearLogs } = useSqlStore();

  if (!isPanelOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={() => setPanelOpen(false)}
      />
      
      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full md:w-1/2 bg-card border-l border-border shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            SQL Query Debugger
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
            >
              Clear Logs
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No SQL queries executed yet. Perform some operations to see queries here.
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        log.operation === 'SELECT' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        log.operation === 'INSERT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        log.operation === 'UPDATE' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {log.operation}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded font-mono">
                      {log.duration}ms
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-foreground mb-1">SQL:</div>
                    <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto font-mono text-foreground">
{log.sql}
                    </pre>
                  </div>

                  {log.params.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-foreground mb-1">Parameters:</div>
                      <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto font-mono text-muted-foreground">
{JSON.stringify(log.params, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};
