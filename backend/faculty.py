from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs
from backend.utils import format_record, format_records

bp = Blueprint('faculty', __name__, url_prefix='/api/faculty')

@bp.route('/', methods=['GET'])
def get_faculty():
    """Get all faculty members."""
    conn = get_db_connection()
    faculty = conn.execute('SELECT * FROM faculty').fetchall()
    return with_query_logs(format_records(faculty))

@bp.route('/<int:id>', methods=['GET'])
def get_faculty_member(id):
    """Get a single faculty member by ID."""
    conn = get_db_connection()
    faculty_member = conn.execute('SELECT * FROM faculty WHERE id = ?', (id,)).fetchone()
    if faculty_member is None:
        return with_query_logs({'error': 'Faculty member not found'}, 404)
    return with_query_logs(format_record(faculty_member))

@bp.route('/', methods=['POST'])
def create_faculty_member():
    """Create a new faculty member."""
    data = request.get_json()
    if not data or not 'firstName' in data or not 'lastName' in data or not 'email' in data:
        return with_query_logs({'error': 'Missing required fields'}, 400)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO faculty (first_name, last_name, email, designation, department_id) VALUES (?, ?, ?, ?, ?)',
            (data['firstName'], data['lastName'], data['email'], data.get('designation'), data.get('departmentId'))
        )
        conn.commit()
        new_faculty_id = cursor.lastrowid

        new_faculty_member = conn.execute('SELECT * FROM faculty WHERE id = ?', (new_faculty_id,)).fetchone()
        return with_query_logs(format_record(new_faculty_member), 201)
    except conn.IntegrityError:
        return with_query_logs({'error': 'Email already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['PUT'])
def update_faculty_member(id):
    """Update an existing faculty member."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}, 400)

    conn = get_db_connection()
    try:
        faculty_member = conn.execute('SELECT * FROM faculty WHERE id = ?', (id,)).fetchone()
        if faculty_member is None:
            return with_query_logs({'error': 'Faculty member not found'}, 404)

        update_fields = {
            'firstName': data.get('firstName', faculty_member['first_name']),
            'lastName': data.get('lastName', faculty_member['last_name']),
            'email': data.get('email', faculty_member['email']),
            'designation': data.get('designation', faculty_member['designation']),
            'departmentId': data.get('departmentId', faculty_member['department_id'])
        }

        conn.execute(
            'UPDATE faculty SET first_name = ?, last_name = ?, email = ?, designation = ?, department_id = ? WHERE id = ?',
            (update_fields['firstName'], update_fields['lastName'], update_fields['email'], update_fields['designation'], update_fields['departmentId'], id)
        )
        conn.commit()

        updated_faculty_member = conn.execute('SELECT * FROM faculty WHERE id = ?', (id,)).fetchone()
        return with_query_logs(format_record(updated_faculty_member))
    except conn.IntegrityError:
        return with_query_logs({'error': 'Email already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['DELETE'])
def delete_faculty_member(id):
    """Delete a faculty member."""
    conn = get_db_connection()
    try:
        faculty_member = conn.execute('SELECT * FROM faculty WHERE id = ?', (id,)).fetchone()
        if faculty_member is None:
            return with_query_logs({'error': 'Faculty member not found'}, 404)

        conn.execute('DELETE FROM faculty WHERE id = ?', (id,))
        conn.commit()
        return with_query_logs({'message': 'Faculty member deleted successfully'}, 200)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)
