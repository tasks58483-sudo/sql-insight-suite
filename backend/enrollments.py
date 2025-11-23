from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs

bp = Blueprint('enrollments', __name__, url_prefix='/api/enrollments')

@bp.route('/', methods=['GET'])
def get_enrollments():
    """Get all enrollments."""
    conn = get_db_connection()
    enrollments = conn.execute('SELECT * FROM enrollments').fetchall()

    return with_query_logs([dict(enrollment) for enrollment in enrollments])

@bp.route('/<int:id>', methods=['GET'])
def get_enrollment(id):
    """Get a single enrollment by ID."""
    conn = get_db_connection()
    enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()

    if enrollment is None:
        return with_query_logs({'error': 'Enrollment not found'}), 404
    return with_query_logs(dict(enrollment))

@bp.route('/', methods=['POST'])
def create_enrollment():
    """Create a new enrollment."""
    data = request.get_json()
    if not data or not 'student_id' in data or not 'course_code' in data:
        return with_query_logs({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO enrollments (student_id, course_code, grade) VALUES (?, ?, ?)',
            (data['student_id'], data['course_code'], data.get('grade'))
        )
        conn.commit()
        new_enrollment_id = cursor.lastrowid


        new_enrollment = {
            'id': new_enrollment_id,
            'student_id': data['student_id'],
            'course_code': data['course_code'],
            'grade': data.get('grade')
        }
        return with_query_logs(new_enrollment), 201
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500

@bp.route('/<int:id>', methods=['PUT'])
def update_enrollment(id):
    """Update an existing enrollment."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}), 400

    conn = get_db_connection()
    try:
        enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
        if enrollment is None:

            return with_query_logs({'error': 'Enrollment not found'}), 404

        update_fields = {
            'student_id': data.get('student_id', enrollment['student_id']),
            'course_code': data.get('course_code', enrollment['course_code']),
            'grade': data.get('grade', enrollment['grade'])
        }

        conn.execute(
            'UPDATE enrollments SET student_id = ?, course_code = ?, grade = ? WHERE id = ?',
            (update_fields['student_id'], update_fields['course_code'], update_fields['grade'], id)
        )
        conn.commit()

        updated_enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()

        return with_query_logs(dict(updated_enrollment))
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500

@bp.route('/<int:id>', methods=['DELETE'])
def delete_enrollment(id):
    """Delete an enrollment."""
    conn = get_db_connection()
    try:
        enrollment = conn.execute('SELECT * FROM enrollments WHERE id = ?', (id,)).fetchone()
        if enrollment is None:

            return with_query_logs({'error': 'Enrollment not found'}), 404

        conn.execute('DELETE FROM enrollments WHERE id = ?', (id,))
        conn.commit()

        return with_query_logs({'message': 'Enrollment deleted successfully'}), 200
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500
