import { useEffect, useMemo } from 'react';
import { ArrowLeft, TrendingUp, Users, BookOpen, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentStore } from '@/stores/student-store';
import { useDepartmentStore } from '@/stores/department-store';
import { useEnrollmentStore } from '@/stores/enrollment-store';
import { useCourseStore } from '@/stores/course-store';
import { Link } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const Analytics = () => {
  const { students, fetchStudents } = useStudentStore();
  const { departments, fetchDepartments } = useDepartmentStore();
  const { enrollments, fetchEnrollments } = useEnrollmentStore();
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchEnrollments();
    fetchCourses();
  }, []);

  const departmentData = useMemo(() => {
    return departments.map(dept => ({
      name: dept.name,
      students: students.filter(s => s.departmentId === dept.id).length
    }));
  }, [departments, students]);

  const enrollmentYearData = useMemo(() => {
    const yearCounts: { [key: number]: number } = {};
    students.forEach(s => {
      if (s.enrollmentYear) {
        yearCounts[s.enrollmentYear] = (yearCounts[s.enrollmentYear] || 0) + 1;
      }
    });
    return Object.entries(yearCounts).map(([year, count]) => ({
      year,
      count
    })).sort((a, b) => Number(a.year) - Number(b.year));
  }, [students]);

  const courseEnrollmentData = useMemo(() => {
    const courseCounts: { [key: string]: number } = {};
    enrollments.forEach(e => {
      courseCounts[e.courseCode] = (courseCounts[e.courseCode] || 0) + 1;
    });
    return Object.entries(courseCounts).map(([code, count]) => ({
      course: courses.find(c => c.code === code)?.name || code,
      enrollments: count
    })).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);
  }, [enrollments, courses]);

  const gradeDistribution = useMemo(() => {
    const grades: { [key: string]: number } = {};
    enrollments.forEach(e => {
      if (e.grade) {
        grades[e.grade] = (grades[e.grade] || 0) + 1;
      }
    });
    return Object.entries(grades).map(([grade, count]) => ({
      grade,
      count
    }));
  }, [enrollments]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Analytics Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Students by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="students"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {departmentData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Students by Enrollment Year</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentYearData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Popular Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseEnrollmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="course" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {gradeDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;