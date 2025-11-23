import { useEffect, useState } from 'react';
import { GraduationCap, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEnrollmentStore } from '@/stores/enrollment-store';
import { useStudentStore } from '@/stores/student-store';
import { useCourseStore } from '@/stores/course-store';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Enrollments = () => {
  const { enrollments, loading, fetchEnrollments, createEnrollment, updateEnrollment, deleteEnrollment } = useEnrollmentStore();
  const { students, fetchStudents } = useStudentStore();
  const { courses, fetchCourses } = useCourseStore();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editEnrollment, setEditEnrollment] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ studentId: 0, courseCode: '', grade: '' });

  useEffect(() => {
    fetchEnrollments();
    fetchStudents();
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editEnrollment) {
        await updateEnrollment(editEnrollment.id, formData);
        toast({ title: 'Enrollment updated successfully' });
        setEditEnrollment(null);
      } else {
        await createEnrollment(formData);
        toast({ title: 'Enrollment added successfully' });
        setIsAddOpen(false);
      }
      setFormData({ studentId: 0, courseCode: '', grade: '' });
    } catch (error) {
      toast({ title: 'Error saving enrollment', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEnrollment(deleteId);
      toast({ title: 'Enrollment deleted successfully' });
      setDeleteId(null);
    } catch (error) {
      toast({ title: 'Error deleting enrollment', variant: 'destructive' });
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
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Course Enrollments</h1>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Enrollment
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
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Enrolled Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => {
                  const student = students.find(s => s.id === enrollment.studentId);
                  const course = courses.find(c => c.code === enrollment.courseCode);
                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">
                        {student ? `${student.firstName} ${student.lastName}` : 'Unknown'}
                      </TableCell>
                      <TableCell>{course?.name || enrollment.courseCode}</TableCell>
                      <TableCell>{enrollment.grade || 'Not graded'}</TableCell>
                      <TableCell>{new Date(enrollment.enrolledAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditEnrollment(enrollment);
                            setFormData({ 
                              studentId: enrollment.studentId, 
                              courseCode: enrollment.courseCode, 
                              grade: enrollment.grade || '' 
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(enrollment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>

      <Dialog open={isAddOpen || !!editEnrollment} onOpenChange={(open) => {
        if (!open) {
          setIsAddOpen(false);
          setEditEnrollment(null);
          setFormData({ studentId: 0, courseCode: '', grade: '' });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editEnrollment ? 'Edit Enrollment' : 'Add Enrollment'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="student">Student</Label>
              <Select
                value={formData.studentId.toString()}
                onValueChange={(value) => setFormData({ ...formData, studentId: Number(value) })}
                disabled={!!editEnrollment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Select
                value={formData.courseCode}
                onValueChange={(value) => setFormData({ ...formData, courseCode: value })}
                disabled={!!editEnrollment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade">Grade (Optional)</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="A, B+, etc."
              />
            </div>
            <Button type="submit" className="w-full">
              {editEnrollment ? 'Update' : 'Add'} Enrollment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this enrollment? This action cannot be undone.
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

export default Enrollments;