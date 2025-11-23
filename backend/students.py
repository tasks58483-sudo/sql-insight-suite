from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs

bp = Blueprint('students', __name__, url_prefix='/api/students')

@bp.route('/', methods=['GET'])
def get_students():
    """Get all students."""
    conn = get_db_connection()
    students = conn.execute('SELECT id, first_name as firstName, last_name as lastName, email, phone, department_id as departmentId, enrollment_year as enrollmentYear FROM students').fetchall()
    return with_query_logs([dict(student) for student in students])

@bp.route('/<int:id>', methods=['GET'])
def get_student(id):
    """Get a single student by ID."""
    conn = get_db_connection()
    student = conn.execute('SELECT id, first_name as firstName, last_name as lastName, email, phone, department_id as departmentId, enrollment_year as enrollmentYear FROM students WHERE id = ?', (id,)).fetchone()
    if student is None:
        return with_query_logs({'error': 'Student not found'}, 404)
    return with_query_logs(dict(student))

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

        new_student = {
            'id': new_student_id,
            'firstName': data['firstName'],
            'lastName': data['lastName'],
            'email': data['email'],
            'phone': data.get('phone'),
            'departmentId': data.get('departmentId'),
            'enrollmentYear': data.get('enrollmentYear')
        }
        return with_query_logs(new_student, 201)
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

        updated_student = conn.execute('SELECT id, first_name as firstName, last_name as lastName, email, phone, department_id as departmentId, enrollment_year as enrollmentYear FROM students WHERE id = ?', (id,)).fetchone()
        return with_query_logs(dict(updated_student))
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
        return with_query_logs({'error': str(e)}), 500
