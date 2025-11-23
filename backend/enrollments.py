from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs
from backend.utils import format_record, format_records

bp = Blueprint('enrollments', __name__, url_prefix='/api/enrollments')

@bp.route('/', methods=['GET'])
def get_enrollments():
    """Get all enrollments."""
    conn = get_db_connection()
    enrollments = conn.execute('SELECT * FROM enrollments').fetchall()
    return with_query_logs(format_records(enrollments))

@bp.route('/<int:id>', methods=['GET'])
def get_enrollment(id):
    """Get a single enrollment by ID."""
    conn = get_db_connection()
    enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
    if enrollment is None:
        return with_query_logs({'error': 'Enrollment not found'}, 404)
    return with_query_logs(format_record(enrollment))

@bp.route('/', methods=['POST'])
def create_enrollment():
    """Create a new enrollment."""
    data = request.get_json()
    if not data or not 'studentId' in data or not 'courseCode' in data:
        return with_query_logs({'error': 'Missing required fields'}, 400)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO enrollments (student_id, course_code, grade) VALUES (?, ?, ?)',
            (data['studentId'], data['courseCode'], data.get('grade'))
        )
        conn.commit()
        new_enrollment_id = cursor.lastrowid

        new_enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (new_enrollment_id,)).fetchone()
        return with_query_logs(format_record(new_enrollment), 201)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['PUT'])
def update_enrollment(id):
    """Update an existing enrollment."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}, 400)

    conn = get_db_connection()
    try:
        enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
        if enrollment is None:
            return with_query_logs({'error': 'Enrollment not found'}, 404)

        update_fields = {
            'studentId': data.get('studentId', enrollment['student_id']),
            'courseCode': data.get('courseCode', enrollment['course_code']),
            'grade': data.get('grade', enrollment['grade'])
        }

        conn.execute(
            'UPDATE enrollments SET student_id = ?, course_code = ?, grade = ? WHERE id = ?',
            (update_fields['studentId'], update_fields['courseCode'], update_fields['grade'], id)
        )
        conn.commit()

        updated_enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
        return with_query_logs(format_record(updated_enrollment))
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['DELETE'])
def delete_enrollment(id):
    """Delete an enrollment."""
    conn = get_db_connection()
    try:
        enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
        if enrollment is None:
            return with_query_logs({'error': 'Enrollment not found'}, 404)

        conn.execute('DELETE FROM enrollments WHERE id = ?', (id,))
        conn.commit()
        return with_query_logs({'message': 'Enrollment deleted successfully'}, 200)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)
