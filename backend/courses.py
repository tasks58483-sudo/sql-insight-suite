from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs
from backend.utils import format_record, format_records

bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@bp.route('/', methods=['GET'])
def get_courses():
    """Get all courses."""
    conn = get_db_connection()
    courses = conn.execute('SELECT * FROM courses').fetchall()
    return with_query_logs(format_records(courses))

@bp.route('/<code>', methods=['GET'])
def get_course(code):
    """Get a single course by code."""
    conn = get_db_connection()
    course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
    if course is None:
        return with_query_logs({'error': 'Course not found'}, 404)
    return with_query_logs(format_record(course))

@bp.route('/', methods=['POST'])
def create_course():
    """Create a new course."""
    data = request.get_json()
    if not data or not 'code' in data or not 'name' in data or not 'credits' in data:
        return with_query_logs({'error': 'Missing required fields'}, 400)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO courses (code, name, credits, description, department_id, faculty_id) VALUES (?, ?, ?, ?, ?, ?)',
            (data['code'], data['name'], data['credits'], data.get('description'), data.get('departmentId'), data.get('facultyId'))
        )
        conn.commit()

        new_course = conn.execute('SELECT * FROM courses WHERE code = ?', (data['code'],)).fetchone()
        return with_query_logs(format_record(new_course), 201)
    except conn.IntegrityError:
        return with_query_logs({'error': 'Course code already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<code>', methods=['PUT'])
def update_course(code):
    """Update an existing course."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}, 400)

    conn = get_db_connection()
    try:
        course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
        if course is None:
            return with_query_logs({'error': 'Course not found'}, 404)

        update_fields = {
            'name': data.get('name', course['name']),
            'credits': data.get('credits', course['credits']),
            'description': data.get('description', course['description']),
            'departmentId': data.get('departmentId', course['department_id']),
            'facultyId': data.get('facultyId', course['faculty_id'])
        }

        conn.execute(
            'UPDATE courses SET name = ?, credits = ?, description = ?, department_id = ?, faculty_id = ? WHERE code = ?',
            (update_fields['name'], update_fields['credits'], update_fields['description'], update_fields['departmentId'], update_fields['facultyId'], code)
        )
        conn.commit()

        updated_course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
        return with_query_logs(format_record(updated_course))
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<code>', methods=['DELETE'])
def delete_course(code):
    """Delete a course."""
    conn = get_db_connection()
    try:
        course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
        if course is None:
            return with_query_logs({'error': 'Course not found'}, 404)

        conn.execute('DELETE FROM courses WHERE code = ?', (code,))
        conn.commit()
        return with_query_logs({'message': 'Course deleted successfully'}, 200)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)
