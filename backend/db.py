import sqlite3
import os
import time
from flask import g, jsonify, Response

DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'database.db')
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'schema.sql')

class LoggingConnection(sqlite3.Connection):
    def execute(self, sql, parameters=()):
        start_time = time.time()
        result = super().execute(sql, parameters)
        duration = time.time() - start_time

        if 'query_logs' not in g:
            g.query_logs = []

        g.query_logs.append({
            'sql': sql,
            'params': parameters,
            'duration': round(duration * 1000, 2) # in ms
        })

        return result

def get_db_connection():
    """Create a database connection."""
    if 'db' not in g:
        g.db = sqlite3.connect(
            DATABASE_PATH,
            factory=LoggingConnection,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db_connection(e=None):
    """Close the database connection."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    """Initialize the app with the database."""
    app.teardown_appcontext(close_db_connection)

def create_database():
    """Create the database tables from the schema file."""
    if os.path.exists(DATABASE_PATH):
        print("Database already exists. Skipping creation.")
        return

    print("Creating database...")
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        with open(SCHEMA_PATH, 'r') as f:
            conn.executescript(f.read())
        conn.close()
        print("Database created successfully.")
    except Exception as e:
        print(f"Error creating database: {e}")
        # Clean up the database file if creation fails
        if os.path.exists(DATABASE_PATH):
            os.remove(DATABASE_PATH)

def with_query_logs(response_data, status_code=200):
    """Add query logs to the response."""
    response = {
        'data': response_data,
        'query_logs': g.get('query_logs', [])
    }
    return Response(
        response=jsonify(response).get_data(),
        status=status_code,
        mimetype='application/json'
    )

if __name__ == '__main__':
    create_database()
