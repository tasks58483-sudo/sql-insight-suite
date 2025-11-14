export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: number;
  enrollmentYear?: number;
}

export interface Department {
  id: number;
  name: string;
  head?: string;
}

export interface Faculty {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  designation?: string;
  departmentId?: number;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  description?: string;
  departmentId?: number;
  facultyId?: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseCode: string;
  grade?: string;
  enrolledAt: Date;
}

export interface QueryLog {
  id: string;
  sql: string;
  params: any[];
  duration: number;
  timestamp: Date;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
}
