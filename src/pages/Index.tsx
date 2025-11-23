import { useEffect, useRef } from 'react';
import { Database, Download, Upload, Building2, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSqlStore } from '@/stores/sql-store';
import { SqlDebuggerPanel } from '@/components/sql-debugger/sql-panel';
import { StudentForm } from '@/components/students/student-form';
import { StudentTable } from '@/components/students/student-table';
import { Link } from 'react-router-dom';
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '@/lib/import-export';
import { useStudentStore } from '@/stores/student-store';
import { useDepartmentStore } from '@/stores/department-store';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { setPanelOpen } = useSqlStore();
  const { students, fetchStudents } = useStudentStore();
  const { departments } = useDepartmentStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleExport = (type: 'json' | 'csv') => {
    if (type === 'json') {
      exportToJSON({ students, departments }, 'student_data');
    } else {
      exportToCSV(students, 'students');
    }
    toast({ title: `Data exported as ${type.toUpperCase()}` });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.endsWith('.json')) {
        const data = await importFromJSON(file);
        toast({ title: 'JSON import successful', description: 'Please refresh to see changes' });
      } else if (file.name.endsWith('.csv')) {
        const data = await importFromCSV(file);
        toast({ title: 'CSV import successful', description: 'Please refresh to see changes' });
      }
    } catch (error: any) {
      toast({ title: 'Import failed', description: error.message, variant: 'destructive' });
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleImport}
        className="hidden"
      />
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Student Management System</h1>
                <p className="text-xs text-muted-foreground">With Interactive SQL Debugger</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleExport('json')}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                variant="outline"
                onClick={() => setPanelOpen(true)}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                SQL Debugger
              </Button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex gap-2 flex-wrap">
            <Link to="/departments">
              <Button variant="ghost" className="gap-2">
                <Building2 className="h-4 w-4" />
                Departments
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="ghost" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </Button>
            </Link>
            <Link to="/enrollments">
              <Button variant="ghost" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                Enrollments
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="ghost" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </nav>
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
