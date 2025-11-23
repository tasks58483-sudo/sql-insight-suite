# Backend Server

This directory contains the Python/Flask backend server for the Student Management System.

## Setup

1.  **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    ```

2.  **Activate the virtual environment:**
    *   **macOS/Linux:**
        ```bash
        source venv/bin/activate
        ```
    *   **Windows:**
        ```bash
        venv\\Scripts\\activate
        ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Create the database:**
    ```bash
    python db.py
    ```

## Running the Server

1.  **Start the Flask server:**
    ```bash
    flask run
    ```

2.  The server will be running at `http://127.0.0.1:5000`.

## API Endpoints

The server exposes the following API endpoints:

*   `GET /api/students`: Get all students
*   `GET /api/students/<id>`: Get a single student by ID
*   `POST /api/students`: Create a new student
*   `PUT /api/students/<id>`: Update an existing student
*   `DELETE /api/students/<id>`: Delete a student
*   And so on for departments, faculty, courses, and enrollments.
