from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs

bp = Blueprint('courses', __name__, url_prefix='/api/courses')

@bp.route('/', methods=['GET'])
def get_courses():
    """Get all courses."""
    conn = get_db_connection()
    courses = conn.execute('SELECT * FROM courses').fetchall()

    return with_query_logs([dict(course) for course in courses])

@bp.route('/<code>', methods=['GET'])
def get_course(code):
    """Get a single course by code."""
    conn = get_db_connection()
    course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()

    if course is None:
        return with_query_logs({'error': 'Course not found'}), 404
    return with_query_logs(dict(course))

@bp.route('/', methods=['POST'])
def create_course():
    """Create a new course."""
    data = request.get_json()
    if not data or not 'code' in data or not 'name' in data or not 'credits' in data:
        return with_query_logs({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO courses (code, name, credits, description, department_id, faculty_id) VALUES (?, ?, ?, ?, ?, ?)',
            (data['code'], data['name'], data['credits'], data.get('description'), data.get('department_id'), data.get('faculty_id'))
        )
        conn.commit()


        new_course = {
            'code': data['code'],
            'name': data['name'],
            'credits': data['credits'],
            'description': data.get('description'),
            'department_id': data.get('department_id'),
            'faculty_id': data.get('faculty_id')
        }
        return with_query_logs(new_course), 201
    except conn.IntegrityError:

        return with_query_logs({'error': 'Course code already exists'}), 409
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500

@bp.route('/<code>', methods=['PUT'])
def update_course(code):
    """Update an existing course."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}), 400

    conn = get_db_connection()
    try:
        course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
        if course is None:

            return with_query_logs({'error': 'Course not found'}), 404

        update_fields = {
            'name': data.get('name', course['name']),
            'credits': data.get('credits', course['credits']),
            'description': data.get('description', course['description']),
            'department_id': data.get('department_id', course['department_id']),
            'faculty_id': data.get('faculty_id', course['faculty_id'])
        }

        conn.execute(
            'UPDATE courses SET name = ?, credits = ?, description = ?, department_id = ?, faculty_id = ? WHERE code = ?',
            (update_fields['name'], update_fields['credits'], update_fields['description'], update_fields['department_id'], update_fields['faculty_id'], code)
        )
        conn.commit()

        updated_course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()

        return with_query_logs(dict(updated_course))
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500

@bp.route('/<code>', methods=['DELETE'])
def delete_course(code):
    """Delete a course."""
    conn = get_db_connection()
    try:
        course = conn.execute('SELECT * FROM courses WHERE code = ?', (code,)).fetchone()
        if course is None:

            return with_query_logs({'error': 'Course not found'}), 404

        conn.execute('DELETE FROM courses WHERE code = ?', (code,))
        conn.commit()

        return with_query_logs({'message': 'Course deleted successfully'}), 200
    except Exception as e:

        return with_query_logs({'error': str(e)}), 500
