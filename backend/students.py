from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs
from backend.utils import format_record, format_records

bp = Blueprint('students', __name__, url_prefix='/api/students')

@bp.route('/', methods=['GET'])
def get_students():
    """Get all students."""
    conn = get_db_connection()
    students = conn.execute('SELECT * FROM students').fetchall()
    return with_query_logs(format_records(students))

@bp.route('/<int:id>', methods=['GET'])
def get_student(id):
    """Get a single student by ID."""
    conn = get_db_connection()
    student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()
    if student is None:
        return with_query_logs({'error': 'Student not found'}, 404)
    return with_query_logs(format_record(student))

@bp.route('/', methods=['POST'])
def create_student():
    """Create a new student."""
    data = request.get_json()
    if not data or not 'firstName' in data or not 'lastName' in data or not 'email' in data:
        return with_query_logs({'error': 'Missing required fields'}, 400)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO students (first_name, last_name, email, phone, department_id, enrollment_year) VALUES (?, ?, ?, ?, ?, ?)',
            (data['firstName'], data['lastName'], data['email'], data.get('phone'), data.get('departmentId'), data.get('enrollmentYear'))
        )
        conn.commit()
        new_student_id = cursor.lastrowid

        new_student = conn.execute('SELECT * FROM students WHERE id = ?', (new_student_id,)).fetchone()
        return with_query_logs(format_record(new_student), 201)
    except conn.IntegrityError:
        return with_query_logs({'error': 'Email already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['PUT'])
def update_student(id):
    """Update an existing student."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}, 400)

    conn = get_db_connection()
    try:
        student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()
        if student is None:
            return with_query_logs({'error': 'Student not found'}, 404)

        update_fields = {
            'firstName': data.get('firstName', student['first_name']),
            'lastName': data.get('lastName', student['last_name']),
            'email': data.get('email', student['email']),
            'phone': data.get('phone', student['phone']),
            'departmentId': data.get('departmentId', student['department_id']),
            'enrollmentYear': data.get('enrollmentYear', student['enrollment_year'])
        }

        conn.execute(
            'UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ?, department_id = ?, enrollment_year = ? WHERE id = ?',
            (update_fields['firstName'], update_fields['lastName'], update_fields['email'], update_fields['phone'], update_fields['departmentId'], update_fields['enrollmentYear'], id)
        )
        conn.commit()

        updated_student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()
        return with_query_logs(format_record(updated_student))
    except conn.IntegrityError:
        return with_query_logs({'error': 'Email already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['DELETE'])
def delete_student(id):
    """Delete a student."""
    conn = get_db_connection()
    try:
        student = conn.execute('SELECT * FROM students WHERE id = ?', (id,)).fetchone()
        if student is None:
            return with_query_logs({'error': 'Student not found'}, 404)

        conn.execute('DELETE FROM students WHERE id = ?', (id,))
        conn.commit()
        return with_query_logs({'message': 'Student deleted successfully'}, 200)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)
