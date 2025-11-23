from flask import Flask
from flask_cors import CORS
import os
from backend import db

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Set the secret key
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'your_secret_key')

    # Set the database path
    app.config['DATABASE'] = os.path.join(os.path.dirname(__file__), 'database.db')

    # Initialize the database
    db.init_app(app)

    @app.route('/')
    def index():
        return "Backend server is running!"

    # Import and register blueprints
    from backend import students, departments, faculty, courses, enrollments
    app.register_blueprint(students.bp)
    app.register_blueprint(departments.bp)
    app.register_blueprint(faculty.bp)
    app.register_blueprint(courses.bp)
    app.register_blueprint(enrollments.bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
