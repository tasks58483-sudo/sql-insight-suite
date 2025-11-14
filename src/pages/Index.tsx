import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSqlStore } from '@/stores/sql-store';
import { SqlDebuggerPanel } from '@/components/sql-debugger/sql-panel';
import { StudentForm } from '@/components/students/student-form';
import { StudentTable } from '@/components/students/student-table';

const Index = () => {
  const { setPanelOpen } = useSqlStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Database className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Student Management System</h1>
              <p className="text-xs text-muted-foreground">With Interactive SQL Debugger</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setPanelOpen(true)}
            className="gap-2"
          >
            <Database className="h-4 w-4" />
            SQL Debugger
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <StudentForm />
          <StudentTable />
        </div>
      </main>

      {/* SQL Debugger Panel */}
      <SqlDebuggerPanel />
    </div>
  );
};

export default Index;
