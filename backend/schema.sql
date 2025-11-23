-- Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;

-- Create the departments table
CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    head TEXT
);

-- Create the students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    department_id INTEGER,
    enrollment_year INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (id)
);

-- Create the faculty table
CREATE TABLE faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    designation TEXT,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (id)
);

-- Create the courses table
CREATE TABLE courses (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL,
    description TEXT,
    department_id INTEGER,
    faculty_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments (id),
    FOREIGN KEY (faculty_id) REFERENCES faculty (id)
);

-- Create the enrollments table
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_code TEXT NOT NULL,
    grade TEXT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students (id),
    FOREIGN KEY (course_code) REFERENCES courses (code)
);
