from flask import Blueprint, request
from backend.db import get_db_connection, with_query_logs
from backend.utils import format_record, format_records

bp = Blueprint('departments', __name__, url_prefix='/api/departments')

@bp.route('/', methods=['GET'])
def get_departments():
    """Get all departments."""
    conn = get_db_connection()
    departments = conn.execute('SELECT * FROM departments').fetchall()
    return with_query_logs(format_records(departments))

@bp.route('/<int:id>', methods=['GET'])
def get_department(id):
    """Get a single department by ID."""
    conn = get_db_connection()
    department = conn.execute('SELECT * FROM departments WHERE id = ?', (id,)).fetchone()
    if department is None:
        return with_query_logs({'error': 'Department not found'}, 404)
    return with_query_logs(format_record(department))

@bp.route('/', methods=['POST'])
def create_department():
    """Create a new department."""
    data = request.get_json()
    if not data or not 'name' in data:
        return with_query_logs({'error': 'Missing required fields'}, 400)

    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO departments (name, head) VALUES (?, ?)',
            (data['name'], data.get('head'))
        )
        conn.commit()
        new_department_id = cursor.lastrowid

        new_department = conn.execute('SELECT * FROM departments WHERE id = ?', (new_department_id,)).fetchone()
        return with_query_logs(format_record(new_department), 201)
    except conn.IntegrityError:
        return with_query_logs({'error': 'Department name already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['PUT'])
def update_department(id):
    """Update an existing department."""
    data = request.get_json()
    if not data:
        return with_query_logs({'error': 'No data provided'}, 400)

    conn = get_db_connection()
    try:
        department = conn.execute('SELECT * FROM departments WHERE id = ?', (id,)).fetchone()
        if department is None:
            return with_query_logs({'error': 'Department not found'}, 404)

        update_fields = {
            'name': data.get('name', department['name']),
            'head': data.get('head', department['head'])
        }

        conn.execute(
            'UPDATE departments SET name = ?, head = ? WHERE id = ?',
            (update_fields['name'], update_fields['head'], id)
        )
        conn.commit()

        updated_department = conn.execute('SELECT * FROM departments WHERE id = ?', (id,)).fetchone()
        return with_query_logs(format_record(updated_department))
    except conn.IntegrityError:
        return with_query_logs({'error': 'Department name already exists'}, 409)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)

@bp.route('/<int:id>', methods=['DELETE'])
def delete_department(id):
    """Delete a department."""
    conn = get_db_connection()
    try:
        department = conn.execute('SELECT * FROM departments WHERE id = ?', (id,)).fetchone()
        if department is None:
            return with_query_logs({'error': 'Department not found'}, 404)

        conn.execute('DELETE FROM departments WHERE id = ?', (id,))
        conn.commit()
        return with_query_logs({'message': 'Department deleted successfully'}, 200)
    except Exception as e:
        return with_query_logs({'error': str(e)}, 500)
