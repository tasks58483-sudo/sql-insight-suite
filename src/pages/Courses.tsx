import { useEffect, useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourseStore } from '@/stores/course-store';
import { useDepartmentStore } from '@/stores/department-store';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Courses = () => {
  const { courses, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourseStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<any>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ code: '', name: '', credits: 3, description: '', departmentId: 0 });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await updateCourse(editCourse.code, formData);
        toast({ title: 'Course updated successfully' });
        setEditCourse(null);
      } else {
        await createCourse({ ...formData, credits: Number(formData.credits) });
        toast({ title: 'Course added successfully' });
        setIsAddOpen(false);
      }
      setFormData({ code: '', name: '', credits: 3, description: '', departmentId: 0 });
    } catch (error) {
      toast({ title: 'Error saving course', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteCode) return;
    try {
      await deleteCourse(deleteCode);
      toast({ title: 'Course deleted successfully' });
      setDeleteCode(null);
    } catch (error) {
      toast({ title: 'Error deleting course', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Course Management</h1>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Course
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.code}>
                    <TableCell className="font-mono">{course.code}</TableCell>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      {departments.find(d => d.id === course.departmentId)?.name || '-'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditCourse(course);
                          setFormData({ 
                            code: course.code,
                            name: course.name,
                            credits: course.credits,
                            description: course.description || '',
                            departmentId: course.departmentId || 0 
                          });
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteCode(course.code)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>

      <Dialog open={isAddOpen || !!editCourse} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditCourse(null);
          setFormData({ code: '', name: '', credits: 3, description: '', departmentId: 0 });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCourse ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!editCourse}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.departmentId.toString()}
                onValueChange={(value) => setFormData({ ...formData, departmentId: Number(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              {editCourse ? 'Update' : 'Add'} Course
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCode} onOpenChange={() => setDeleteCode(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;