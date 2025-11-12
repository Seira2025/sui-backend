# GitHub Copilot Instructions for Seira Backend

## Overview
This document provides essential guidance for AI coding agents working with the Seira backend codebase. The backend is built using Flask and SQLAlchemy, providing a REST API and ORM capabilities.

## Architecture
- **Main Components**:
  - **Flask**: Serves as the HTTP server and handles API requests. The entry point is located in `backend/app.py`.
  - **SQLAlchemy**: Manages database interactions through ORM models defined in `backend/models.py`.
  - **Database**: SQLite is used for local persistence, with the database file located at `backend/app.db`.

- **Data Flow**: Requests are routed through Flask, which interacts with the database via SQLAlchemy models. The `database.py` file contains engine and session helpers to facilitate these interactions.

## Developer Workflows
- **Running the Application**: Use the command `flask run --host=0.0.0.0 --port=5000` to start the server. Ensure the virtual environment is activated.
- **Seeding the Database**: Run `python backend/seed.py` to create and populate the database with initial data.
- **Testing**: Implement tests in a dedicated test directory (not shown in the current structure). Use `pytest` for running tests.

## Project Conventions
- **File Structure**: Follow the established layout in the `backend/` directory. Each file has a specific role, e.g., `config.py` for configuration settings and `models.py` for database models.
- **Naming Conventions**: Use snake_case for file names and variable names, and CamelCase for class names.

## Integration Points
- **External Dependencies**: The project relies on Flask and SQLAlchemy. Ensure these are included in `requirements.txt` for package management.
- **Cross-Component Communication**: API endpoints defined in `app.py` interact with models in `models.py` to perform CRUD operations on the database.

## Examples
- **Creating a New Model**: To add a new model, define it in `models.py` and ensure it is registered in the database session in `database.py`.
- **Adding a New API Endpoint**: Modify `app.py` to include new routes that utilize the existing models for data retrieval or manipulation.

## Conclusion
This document serves as a foundational guide for AI agents to navigate and contribute effectively to the Seira backend codebase. For further details, refer to the specific files mentioned above.